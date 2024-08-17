#!/bin/bash

# Directories to exclude
EXCLUDE_DIRS=("node_modules" "deployments")

# Function to process files
process_file() {
    local filepath=$1
    local filename=$(basename "$filepath")
    local dirpath=$(dirname "$filepath")
    
    # Print the relative path of the file
    echo "$dirpath/$filename"
    
    # Remove comments from the file and print the modified content
    # Supports C, C++, Java, JavaScript, Solidity, etc.
    sed -e 's/^\s*\/\/.*$//' -e 's/\/\*[^*]*\*\/\s*//' -e '/\/\*/,/\*\//d' "$filepath"
    
    # Print a newline for separation between files
    echo ""
}

# Function to iterate over the directory
iterate_directory() {
    local dir=$1
    for entry in "$dir"/*; do
        if [ -d "$entry" ]; then
            # Skip excluded directories
            if [[ ! " ${EXCLUDE_DIRS[@]} " =~ " $(basename "$entry") " ]]; then
                iterate_directory "$entry"
            fi
        elif [ -f "$entry" ]; then
            process_file "$entry"
        fi
    done
}

# Start from the current directory
iterate_directory "."

