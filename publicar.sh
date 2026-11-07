#!/usr/bin/env bash
# Publica o site da Geovana no GitHub Pages: cria o repositório fnaime13-max/geovanavidor,
# envia a branch main e liga o Pages. Usa a credencial do GitHub que o Git já tem salva.
set -e
cd "$(dirname "$0")"
REPO=geovanavidor
DONO=fnaime13-max
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill | sed -n 's/^password=//p')
API="https://api.github.com"
H=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")

echo "1/3 Criando o repositorio $DONO/$REPO..."
curl -s "${H[@]}" "$API/user/repos" \
  -d "{\"name\":\"$REPO\",\"description\":\"Site Geovana Vidor - Nutricionista\",\"homepage\":\"https://geovanavidor.felixdias.com/\",\"private\":false,\"has_issues\":false,\"has_wiki\":false}" \
  | grep -o '"full_name": "[^"]*"\|"message": "[^"]*"' | head -1

echo "2/3 Enviando os arquivos..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$DONO/$REPO.git"
git push -u origin main

echo "3/3 Ligando o GitHub Pages..."
curl -s "${H[@]}" "$API/repos/$DONO/$REPO/pages" -d '{"source":{"branch":"main","path":"/"}}' \
  | grep -o '"html_url": "[^"]*"\|"message": "[^"]*"' | head -1

echo "Pronto: https://geovanavidor.felixdias.com/"
echo "4/4 Configurando o dominio geovanavidor.felixdias.com..."
curl -s -X PUT "${H[@]}" "$API/repos/$DONO/$REPO/pages" -d '{"cname":"geovanavidor.felixdias.com"}' -o /dev/null -w "%{http_code}\n"
