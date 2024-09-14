import json

def extract_unique_categories(file_path):
    unique_categories = set()

    
    with open(file_path, 'r') as file:
        data = json.load(file)
        
        
        if isinstance(data, list):
            
            for recipe in data:
                if 'categories' in recipe and isinstance(recipe['categories'], list):
                    unique_categories.update(recipe['categories'])
        elif isinstance(data, dict):
            
            if 'categories' in data and isinstance(data['categories'], list):
                unique_categories.update(data['categories'])
        else:
            raise ValueError("JSON data is neither a list of recipes nor a single recipe")

    return unique_categories


