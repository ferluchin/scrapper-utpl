import json

# Abrir el archivo de entrada y cargar los datos JSON
with open('input.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Crear un diccionario vacío para contener los datos de salida
output = {}

# Iterar a través de cada diccionario en la lista de datos de entrada
for item in data:
    # Verificar si el diccionario contiene una clave que comienza con "Title"
    if any(key.startswith("Title") for key in item.keys()):
        # Si es así, usar el valor de la clave "Title" como clave en el diccionario de salida,
        # y usar el valor de la clave "Title_URL" como valor en el diccionario de salida.
        title = item["Title"]
        url = item["Title_URL"]
        output[title] = url

# Escribir los datos de salida en un archivo
with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False)