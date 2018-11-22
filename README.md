# Reactron = Dynamic Electron React Module Loader

Electron based application framework based on to dynamically load external services and react components.

## Installation
#### Automatic Installation (Raspberry Pi only!)
```
bash -c "$(curl -sL https://raw.githubusercontent.com/schirkan/reactron/master/installer/setup.sh)"
```

#### Manual install
```
git clone https://github.com/schirkan/reactron
cd reactron
npm i
cd modules
git clone https://github.com/schirkan/reactron-admin
git clone https://github.com/schirkan/reactron-hello-world
cd ..
npm run start
```

## Modules
- Example Module: [reactron-hello-world](https://github.com/schirkan/reactron-hello-world)
- Admin Module: [reactron-admin](https://github.com/schirkan/reactron-admin)
- Analog Clock: [reactron-analog-clock](https://github.com/schirkan/reactron-analog-clock)

### License
MIT

### Inspired by
https://github.com/natergj/dynamic-react-module
https://github.com/MichMich/MagicMirror
