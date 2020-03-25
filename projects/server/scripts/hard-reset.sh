
SCRIPT_PATH=$( cd $(dirname $0) ; pwd -P )

docker-compose -f "${SCRIPT_PATH}/../docker-compose.yaml" down -v
docker-compose -f "${SCRIPT_PATH}/../docker-compose.yaml" up -d 

echo 'Running migrations...'
yarn start & > /dev/null
JOB_ID="$!"
sleep 10
echo "Killing migration job... hope it worked"
kill "$JOB_ID"

$SCRIPT_PATH/insert-admin.sh