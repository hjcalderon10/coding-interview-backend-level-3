#!/bin/sh
find dist -type f -name '*.js' | while read file; do
  if [[ $(uname) == "Darwin" ]]; then
    sed -i '' 's#@/#/app/dist/#g' "$file"
  else
    sed -i 's#@/#/app/dist/#g' "$file"
  fi
done
