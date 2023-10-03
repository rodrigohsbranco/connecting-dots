#!/bin/sh

nome_projeto=ligar_pontos

json=$(cat public/package.json)

current_version=$(echo "$json" | grep -oP '(?<="version": )[^,}]+')
new_version=$(echo "$current_version + 1" | bc)
new_json=$(echo "$json" | sed "s/\"version\": $current_version/\"version\": $new_version/")
echo "$new_json" >public/package.json
echo "$new_json" >$nome_projeto/package.json

zip -r $nome_projeto.zip $nome_projeto
cp public/package.json $nome_projeto.json

rsync -uahvrztP -e 'ssh -p 2608' --compress-level=5 --progress $nome_projeto.zip $nome_projeto.json root@visualfest.com.br:/var/www/html/visualfest.com.br/mobetech/creche

rm $nome_projeto.zip
rm $nome_projeto.json
