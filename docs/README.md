# TypeSheet

Projekt wykonany jako praca inżynierska.

## Tematyka pracy

Tworzenie interaktywnego edytora nutowego z funkcjami wspomagającymi kompozycję polega na zaprojektowaniu oprogramowania, które nie tylko umożliwia użytkownikom wprowadzanie i edytowanie notacji muzycznej, ale także oferuje narzędzia wspomagające proces kompozycji. Taka aplikacja zapewnia przyjazny interfejs, w którym muzycy mogą łatwo pisać, modyfikować i organizować swoje muzyczne pomysły. Dodatkowo, program może zawierać funkcje takie jak analiza harmoniczna, możliwość odtwarzania skomponowanych utworów w czasie rzeczywistym czy możliwość zapisu dźwięków odgrywanych na fizycznych instrumentach przy wykorzystaniu np. intefejsu MIDI. Dzięki temu twórcy muzyki mają więcej możliwości eksperymentowania i doskonalenia swoich kompozycji w wygodny i efektywny sposób.
Trudność pracy polega na implementacji szybkiej w działaniu edycji notacji pozwalającej na maksymalną optymalizację pracy, np. poprzez umożliwienie użytkownikowi korzystanie ze skrótów klawiszowych. Przy okazji konieczne będzia odpowiednia implementacja wyświetlania notacji, by była ona czytelna i wspomagała optymalne tempo pracy. Kolejna z trudności może wystąpić przy okazji implementacji obsługi interfejsu MIDI. Dźwięki poszczególnych instrumentów powinny być pobrane z otwartych zasobów.

## Used Fonts
We are using Bravera font, which is based on [SMuFL](https://w3c.github.io/smufl/latest/index.html).

## Recommended IDE Setup

-[VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
