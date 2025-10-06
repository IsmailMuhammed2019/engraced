#!/bin/bash

echo "🧹 Clearing sample data from database..."

# Clear sample driver data
echo "Deleting sample driver..."
docker-compose exec -T postgres psql -U postgres -d engracedsmile -c "
DELETE FROM trips WHERE \"driverId\" IN (
  SELECT id FROM drivers WHERE email = 'driver@engracedsmile.com'
);
DELETE FROM drivers WHERE email = 'driver@engracedsmile.com';
"

# Clear sample vehicle data
echo "Deleting sample vehicle..."
docker-compose exec -T postgres psql -U postgres -d engracedsmile -c "
DELETE FROM trips WHERE \"vehicleId\" IN (
  SELECT id FROM vehicles WHERE \"plateNumber\" = 'LAG123ABC'
);
DELETE FROM vehicles WHERE \"plateNumber\" = 'LAG123ABC';
"

# Clear any remaining sample trips
echo "Deleting sample trips..."
docker-compose exec -T postgres psql -U postgres -d engracedsmile -c "
DELETE FROM trips WHERE \"driverId\" IN (
  SELECT id FROM drivers WHERE email = 'sample@engracedsmile.com'
);
DELETE FROM drivers WHERE email = 'sample@engracedsmile.com';
"

echo "✅ Sample data cleared successfully!"
echo "Now you can test your drivers page - deleted drivers should stay deleted."
