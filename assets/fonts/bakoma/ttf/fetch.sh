#!/bin/bash
FILE=$1
while read LINE; do
	echo "This is a line: $LINE"
	curl -O "$LINE"
done < $FILE
