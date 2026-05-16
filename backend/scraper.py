import time
import json
import os
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class JofynScraper:
    def __init__(self):
        self.options = Options()
        # self.options.add_argument('--headless') # Uncomment for headless mode
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        self.driver = None

    def start_driver(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=self.options)

    def stop_driver(self):
        if self.driver:
            self.driver.quit()

    def scrape_jobstreet(self, keywords, locations):
        # Implementation for Jobstreet
        print(f"Scraping Jobstreet for {keywords} in {locations}...")
        # Mocking some results for demonstration
        return [
            {"company": "Jobstreet Corp", "role": f"{keywords[0]} Developer", "salary": "Rp 10M - 15M", "location": locations[0] if locations else "Jakarta", "type": "WFO", "platform": "Jobstreet", "date": time.strftime("%d-%m-%Y"), "status": "Belum Lamar"}
        ]

    def scrape_glints(self, keywords, locations):
        # Implementation for Glints
        print(f"Scraping Glints for {keywords} in {locations}...")
        return [
            {"company": "Glints Startup", "role": f"Senior {keywords[0]} Engineer", "salary": "Rp 12M - 18M", "location": locations[0] if locations else "Jakarta", "type": "Remote", "platform": "Glints", "date": time.strftime("%d-%m-%Y"), "status": "Belum Lamar"}
        ]

    def run(self, keywords, locations, targets):
        results = []
        self.start_driver()
        try:
            if 'Jobstreet' in targets:
                results.extend(self.scrape_jobstreet(keywords, locations))
            if 'Glints' in targets:
                results.extend(self.scrape_glints(keywords, locations))
            # Add other targets...
        finally:
            self.stop_driver()
        
        return results

def save_results(results):
    timestamp = int(time.time())
    json_filename = f"data/json_{timestamp}.json"
    csv_filename = "data/MasterData.xlsx" # Saving as Excel for multiple sheets/convenience
    
    os.makedirs('data', exist_ok=True)
    
    # Save JSON
    with open(json_filename, 'w') as f:
        json.dump(results, f, indent=4)
    
    # Save/Update Excel (Master Data)
    df = pd.DataFrame(results)
    if os.path.exists(csv_filename):
        with pd.ExcelWriter(csv_filename, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            df.to_excel(writer, sheet_name=f"Search_{timestamp}", index=False)
    else:
        df.to_excel(csv_filename, sheet_name=f"Search_{timestamp}", index=False)
    
    return json_filename, csv_filename
