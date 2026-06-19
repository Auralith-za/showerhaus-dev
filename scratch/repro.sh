#!/bin/bash
npm run dev -- --port 3005 > dev.log 2>&1 &
DEV_PID=$!
sleep 10
curl -i -X POST "http://localhost:3005/cart" \
  -H "Content-Type: multipart/form-data; boundary=------------------------12345" \
  -d $'--------------------------12345\r\nContent-Disposition: form-data; name="cartFormInput"\r\n\r\n{"action":"LinesAdd","inputs":{"lines":[{"merchandiseId":"gid://shopify/ProductVariant/66832563536176","quantity":1}]}}\r\n--------------------------12345--' > curl_out.txt 2>&1
kill $DEV_PID
cat dev.log | grep -i "error" -A 20
