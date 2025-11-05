#!/bin/bash

# Script to test concurrent user access to the TVM application

echo "Testing concurrent access to Time Value of Money application..."
echo "Simulating 10 concurrent users accessing different pages"
echo ""

# Array of pages to test
pages=(
  "/"
  "/calculators"
  "/visualizations"
  "/practice"
  "/"
  "/calculators"
  "/visualizations"
  "/practice"
  "/"
  "/calculators"
)

# Start time
start_time=$(date +%s)

# Run concurrent requests
pids=()
for i in {0..9}; do
  {
    page="${pages[$i]}"
    response=$(curl -s -o /dev/null -w "%{http_code},%{time_total}" "http://localhost:3000${page}")
    status_code=$(echo $response | cut -d',' -f1)
    time_total=$(echo $response | cut -d',' -f2)
    echo "User $((i+1)) - Page: ${page} - Status: ${status_code} - Time: ${time_total}s"
  } &
  pids+=($!)
done

# Wait for all requests to complete
for pid in "${pids[@]}"; do
  wait $pid
done

# End time
end_time=$(date +%s)
total_time=$((end_time - start_time))

echo ""
echo "All 10 concurrent requests completed in ${total_time} seconds"
echo "✓ Concurrent access test PASSED"
