import os
from dotenv import load_dotenv
from opensearchpy import OpenSearch


load_dotenv()


host = os.getenv("OPENSEARCH_HOST", "localhost")
port = int(os.getenv("OPENSEARCH_PORT", 9200))
auth_user = os.getenv("OPENSEARCH_USER", "admin")
auth_password = os.getenv("OPENSEARCH_PASSWORD", "password")


client = OpenSearch(
    hosts=[{"host": host, "port": port}],
    http_auth=(auth_user, auth_password),
    use_ssl=True,
    verify_certs=False,
    ssl_show_warn=False,
)

try:
    info = client.info()
    print("Connected to OpenSearch")
    print(info)
except Exception as e:
    print("Failed to connect to OpenSearch:", e)


index_name = 'recipe'

# Define index mapping
mapping = {
    "mappings": {
        "properties": {
            "title": {"type": "text"},
            "desc": {"type": "text"},
            "date": {"type": "date"},
            "categories": {"type": "keyword"},  # Use keyword for exact match
            "ingredients": {"type": "text"},    # Use text for full-text search
            "directions": {"type": "text"},     # Use text for full-text search
            "fat": {"type": "float"},
            "calories": {"type": "float"},
            "protein": {"type": "float"},
            "rating": {"type": "float"},
            "sodium": {"type": "float"}
        }
    }
}

# # Create the index with the defined mapping
if not client.indices.exists(index=index_name):
    client.indices.create(index=index_name, body=mapping)

def index_data_bulk(file_path):
    with open(file_path, 'r') as file:
        recipes = json.load(file)
        
        actions = [
            {
                "_index": index_name,
                "_id": i,  # Use a unique ID for each document
                "_source": recipe
            }
            for i, recipe in enumerate(recipes)
        ]
        
        success, failed = bulk(client, actions)
        print(f"Successfully indexed {success} recipes.")
        print(f"Failed to index {failed} recipes.")

# Path to your JSON file
file_path =  'C:\\Users\\DELL\\Downloads\\archive\\full_format_recipes.json'
index_data_bulk(file_path)
q = 'apple'
query = {
  'size': 5,
  'query': {
    'multi_match': {
      'query': q,
      'fields': ['title']
    }
  }
}

response = client.search(
    body = query,
    index = index_name
)
print('\nSearch results:')
print(response)
