
if [ "" != "$2" ]; then
    echo "BOOT: $2"
    humble stop $2
    humble rm -f $2
    humble up -d $2
    humble logs -f $2
else
    humble info
    humble down
    humble up -d
    humble logs -f
fi
