docker stop qa-system
docker rm qa-system
docker build -t qa-verification-system .
docker run -d \
  --name qa-system \
  -p 5001:5001 \
  qa-verification-system