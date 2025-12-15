# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import random
import urllib.parse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/quotes")
async def get_quotes(count: int = 10):
    url = "https://quotes.toscrape.com/"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    quotes = []
    quote_elements = soup.find_all('div', class_='quote')
    
    for quote_elem in quote_elements[:count]:
        text = quote_elem.find('span', class_='text').text
        author = quote_elem.find('small', class_='author').text
        quotes.append({"text": text, "author": author})
    
    # Add some randomness for demo
    random.shuffle(quotes)
    return {"quotes": quotes[:count]}

@app.get("/api/books")
async def get_books(count: int = 10):
    url = "http://books.toscrape.com/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    books = []
    book_elements = soup.find_all('article', class_='product_pod')
    
    for book_elem in book_elements[:count]:
        title_elem = book_elem.find('h3')
        title = title_elem.find('a')['title'] if title_elem and title_elem.find('a') else "Unknown"
        
        price_elem = book_elem.find('p', class_='price_color')
        price = price_elem.text.strip() if price_elem else "$0.00"
        
        rating_elem = book_elem.find('p', class_='star-rating')
        rating_class = rating_elem['class'][1] if rating_elem and len(rating_elem['class']) > 1 else 'None'
        rating = rating_class.replace('star-rating ', '').title()
        
        img_elem = book_elem.find('img')
        img_src = img_elem['src'] if img_elem else ''
        image_url = urllib.parse.urljoin(url, img_src) if img_src else ''
        
        detail_link_elem = title_elem.find('a') if title_elem else None
        detail_url = f"http://books.toscrape.com/{detail_link_elem['href']}" if detail_link_elem else ""
        
        books.append({
            "title": title,
            "price": price,
            "rating": rating,
            "image_url": image_url,
            "detail_url": detail_url
        })
    
    random.shuffle(books)
    return {"books": books[:count]}


@app.get("/")
async def root():
    return [{"message": "Quotes Scraper API is running!", "endpoint": "/api/quotes?count=10"}, {"message": "Books Scraper API is running!", "endpoint": "/api/books?count=10"}]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
