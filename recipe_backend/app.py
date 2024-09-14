from flask import Flask, request,jsonify
from flask_cors import CORS
from collections import defaultdict
from search import os_title_search
from test import extract_unique_categories
from receipe import get_document_by_id
from search import top_rated_recipes
from search import search_recipes
from search import os_top_rated_recipes
from unique_categories import get_unique_categories
import json
from search import get_suggestions
from unique_categories import get_unique_categories_and_count
import os_connect
app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return "hello World!"

@app.route("/api/recipes/search", methods=['GET'])
def search():
    # print("i")
    query = request.args.get('search', '')
    filters = parse_filters(request.args)
    print(f"Search query: {query}")
    print(f"Filters: {filters}")
    rec=search_recipes(query=query,filters=filters)
    # rec=os_title_search(q=query)
    
    return jsonify(rec)  
 


@app.route("/api/categories",methods=['GET'])
def categories():
    query = request.args.get('size','')
    #res=get_unique_categories(size=query)
    #res = get_unique_categories_and_count()
    res =extract_unique_categories('C:\\Users\\DELL\\Downloads\\archive\\full_format_recipes.json')
    print("Unique Categories:")
    # for category in res:
    #     print(category)
    #print(res)
    print(len(list(res)))
    return jsonify(list(res))

@app.route("/api/recipes/top-rated",methods=['GET'])
def topRecipes():
    print("top Rated:")
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', 10))
    rec=os_top_rated_recipes()
    #rec=top_rated_recipes(page,size)
    # rec=search_recipes(query=query,filters=filters)
    
    return jsonify(rec)


@app.route('/api/suggestions', methods=['GET'])
def suggestions():
    print("suggestions:")
    query = request.args.get('query', '')  # Default to empty string if not provided
    search_by = request.args.get('searchBy', 'title')  # Default to 'title' if not provided
    res, status_code = get_suggestions(query, search_by)
    print(status_code)
    return jsonify(res), status_code

@app.route('/api/recipes/<id>', methods=['GET'])
def recipe(id):
    print("receipe Details:")
    res = get_document_by_id(id)
    return jsonify(res)


def parse_filters(args):
    filters = defaultdict(dict)

    for key, value in args.items():
        print(f'key{key},val:{value}')
        
        if key.startswith('filters[') and key.endswith(']'):
            # Remove 'filters[' and ']'
            key = key[len('filters['):-1]
            # Split the key on '['
            parts = key.split('][')
            # Navigate through the nested dictionary
            d = filters
            for part in parts[:-1]:
                if part not in d:
                    d[part] = {}
                d = d[part]
            # Assign the value to the final key
            d[parts[-1]] = value

    return filters

