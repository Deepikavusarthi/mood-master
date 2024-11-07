

# Mood Master Server


### Set .env

```bash
cp .env.example .env
set DATABASE_URL=your_postgres_url
```


### Create virtual environment and install dependencies

```bash
python -m venv venv
source venv/bin/activate # On macOS and Linux | venv/Scripts/activate # On Windows           
python -m pip install --upgrade pip
pip install "fastapi[standard]"
pip install -r requirements.txt
```

-  Go to the (http://127.0.0.1:8000/docs)! and find all the endpoints















------------ Avoid this ------------


# Command to create server

```
python -m venv venv
venv/Scripts/activate
python -m pip install --upgrade pip
pip install "fastapi[standard]"
pip install -r requirements.txt
```