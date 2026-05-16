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

    def scrape_glints(self, keywords, locations):
        results = []
        base_url = "https://glints.com/id/opportunities/jobs/explore"
        
        for keyword in keywords:
            loc_query = "+".join(locations) if locations else "All+Cities%2FProvinces"
            search_url = f"{base_url}?keyword={keyword}&country=ID&locationName={loc_query}"
            
            self.driver.get(search_url)
            time.sleep(3) # Wait for initial load
            
            # Handle possible login popup or cookie banner
            try:
                close_btn = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "button.ModalStyle__CloseButton-sc-16o88re-1, .lc-x-button"))
                )
                close_btn.click()
            except:
                pass

            # Scroll to load more if needed
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
            time.sleep(2)

            cards = self.driver.find_elements(By.CSS_SELECTOR, '[data-glints-tracking-element-name="job_card"]')
            for card in cards[:10]: # Limit to top 10 for demo/speed
                try:
                    role = card.find_element(By.CSS_SELECTOR, 'h2[class*="JobTitle"]').text
                    company = card.find_element(By.CSS_SELECTOR, 'a[class*="CompanyLinkResolver"]').text
                    
                    try:
                        salary = card.find_element(By.CSS_SELECTOR, 'span[class*="SalaryWrapper"]').text
                    except:
                        salary = "Rahasia"
                        
                    try:
                        loc = card.find_element(By.CSS_SELECTOR, 'div[class*="LocationWrapper"]').text
                    except:
                        loc = locations[0] if locations else "Unknown"

                    results.append({
                        "company": company,
                        "role": role,
                        "salary": salary,
                        "location": loc,
                        "type": "Penuh Waktu",
                        "platform": "Glints",
                        "date": time.strftime("%d-%m-%Y"),
                        "status": "Belum Lamar"
                    })
                except Exception as e:
                    print(f"Error parsing Glints card: {e}")
        return results

    def scrape_jobstreet(self, keywords, locations):
        results = []
        base_url = "https://id.jobstreet.com/id/it-jobs" # Starting point
        
        for keyword in keywords:
            self.driver.get(base_url)
            time.sleep(3)
            
            try:
                # Input Keywords
                kw_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.ID, "keywords-input"))
                )
                kw_input.clear()
                kw_input.send_keys(keyword)
                
                # Input Location
                if locations:
                    loc_input = self.driver.find_element(By.ID, "SearchBar__Where")
                    loc_input.clear()
                    loc_input.send_keys(locations[0])
                
                # Click Search (finding the 'Cari' button)
                search_btn = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
                search_btn.click()
                time.sleep(5) # Wait for results
                
                # Extract results from Jobstreet
                # Jobstreet cards usually have data-automation="jobCard"
                cards = self.driver.find_elements(By.CSS_SELECTOR, 'article[data-automation="jobCard"]')
                for card in cards[:10]:
                    try:
                        role = card.find_element(By.CSS_SELECTOR, 'a[data-automation="jobTitle"]').text
                        company = card.find_element(By.CSS_SELECTOR, 'a[data-automation="jobCompany"]').text
                        
                        try:
                            loc = card.find_element(By.CSS_SELECTOR, 'a[data-automation="jobLocation"]').text
                        except:
                            loc = "Unknown"
                            
                        try:
                            # Salary might not always be there
                            salary = card.find_element(By.CSS_SELECTOR, 'span[data-automation="jobSalary"]').text
                        except:
                            salary = "Rahasia"

                        results.append({
                            "company": company,
                            "role": role,
                            "salary": salary,
                            "location": loc,
                            "type": "Kontrak/Temporer",
                            "platform": "Jobstreet",
                            "date": time.strftime("%d-%m-%Y"),
                            "status": "Belum Lamar"
                        })
                    except Exception as e:
                        print(f"Error parsing Jobstreet card: {e}")
            except Exception as e:
                print(f"Error navigating Jobstreet: {e}")
                
        return results

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
