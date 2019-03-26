
if [ "" != "$2" ]; then
    echo "Kill: $2"
    humble stop $2
    humble rm -f $2
else
    echo "Kill All (this is the hard way)"
    enterToContinue
    humble down
fi
