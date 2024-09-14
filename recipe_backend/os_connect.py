import os
from dotenv import load_dotenv
from opensearchpy import OpenSearch



load_dotenv()
host = os.getenv("OPENSEARCH_HOST", "localhost")
port = int(os.getenv("OPENSEARCH_PORT", 9200))
auth_user = os.getenv("OPENSEARCH_USER", "admin")
auth_password = os.getenv("OPENSEARCH_PASSWORD", "password")
print(host,port,auth_password,auth_user)


client = OpenSearch(
    hosts=[{"host": host, "port": port}],
    http_auth=(auth_user, auth_password),
    use_ssl=True,
    verify_certs=False,
    ssl_show_warn=False,
)

index_name = 'recipe'


