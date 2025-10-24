# Use nginx to serve static files
FROM nginx:alpine

# Copy frontend files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

# Copy config file - use config.js if exists, otherwise use example
COPY config.*.js /usr/share/nginx/html/
RUN if [ ! -f /usr/share/nginx/html/config.js ]; then \
        cp /usr/share/nginx/html/config.example.js /usr/share/nginx/html/config.js; \
    fi

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

