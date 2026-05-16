from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import threading
import time
from cv_parser import extract_text_from_docx, get_keywords
from scraper import JofynScraper, save_results

app = Flask(__name__)
CORS(app)

# Global state for tracking progress and logs
scraping_state = {
    "status": "idle",
    "progress": 0,
    "logs": [],
    "results": []
}

@app.route('/api/upload', methods=['POST'])
def upload_cv():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not file.filename.endswith(('.doc', '.docx')):
        return jsonify({"error": "Invalid file format. Only .doc and .docx are allowed."}), 400

    os.makedirs('uploads', exist_ok=True)
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)

    # Parse CV
    text = extract_text_from_docx(file_path)
    keywords = get_keywords(text)
    
    return jsonify({
        "message": "File uploaded and parsed successfully",
        "keywords": keywords,
        "filename": file.filename
    })

@app.route('/api/start', methods=['POST'])
def start_scraping():
    data = request.json
    keywords = data.get('keywords', [])
    locations = data.get('locations', [])
    targets = data.get('targets', ['Glints', 'Jobstreet', 'KitaLulus', 'Tech in Asia', 'Pintarnya', 'LinkedIn'])

    if scraping_state["status"] == "running":
        return jsonify({"error": "Scraper is already running"}), 400

    # Reset state
    scraping_state["status"] = "running"
    scraping_state["progress"] = 0
    scraping_state["logs"] = ["[SYSTEM] Memulai engine CLI JOFYN..."]
    scraping_state["results"] = []

    # Run scraper in a separate thread
    thread = threading.Thread(target=run_scraping_task, args=(keywords, locations, targets))
    thread.start()

    return jsonify({"message": "Scraping started"})

def run_scraping_task(keywords, locations, targets):
    scraper = JofynScraper()
    try:
        scraping_state["logs"].append(f"[CV_PARSE] Keyword ditemukan: {', '.join(keywords)}")
        scraping_state["progress"] = 10
        
        # Scrape
        results = scraper.run(keywords, locations, targets)
        
        scraping_state["logs"].append("[ENGINE] Membersihkan duplikat dan memformat ke JSON...")
        scraping_state["progress"] = 90
        
        # Save results
        json_file, excel_file = save_results(results)
        
        scraping_state["logs"].append(f"[SYSTEM] Selesai! Data disimpan di {json_file}")
        scraping_state["progress"] = 100
        scraping_state["status"] = "completed"
        scraping_state["results"] = results

    except Exception as e:
        scraping_state["status"] = "error"
        scraping_state["logs"].append(f"[ERROR] {str(e)}")
    finally:
        scraper.stop_driver()

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify(scraping_state)

@app.route('/api/history', methods=['GET'])
def get_history():
    history = []
    if os.path.exists('data'):
        for filename in os.listdir('data'):
            if filename.endswith('.json'):
                path = os.path.join('data', filename)
                with open(path, 'r') as f:
                    data = json.load(f)
                    # Convert filename timestamp to readable date
                    # filename is json_123456789.json
                    try:
                        ts = int(filename.split('_')[1].split('.')[0])
                        date_str = time.strftime('%d %B %Y', time.localtime(ts))
                        history.append({
                            "id": filename.replace('.json', ''),
                            "date": date_str,
                            "total": len(data)
                        })
                    except:
                        pass
    return jsonify(sorted(history, key=lambda x: x['id'], reverse=True))

@app.route('/api/data/<id>', methods=['GET'])
def get_data(id):
    path = os.path.join('data', f"{id}.json")
    if os.path.exists(path):
        with open(path, 'r') as f:
            return jsonify(json.load(f))
    return jsonify({"error": "Data not found"}), 404

if __name__ == '__main__':
    app.run(port=5000, debug=True)
