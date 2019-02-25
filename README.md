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
cd ..
npm run start
```

## Modules
- Example Module: [reactron-hello-world](https://github.com/schirkan/reactron-hello-world)
- Admin Module: [reactron-admin](https://github.com/schirkan/reactron-admin)
- Analog Clock: [reactron-analog-clock](https://github.com/schirkan/reactron-analog-clock)
- Weather (http://openweathermap.org): [reactron-openweathermap](https://github.com/schirkan/reactron-openweathermap)
- Dashboard: [reactron-scifi-dashboard](https://github.com/schirkan/reactron-scifi-dashboard)
- Shopping list (http://getbring.com): [reactron-bring-shopping-list](https://github.com/schirkan/reactron-bring-shopping-list)
- Public transport (DE): [reactron-vrr-departure](https://github.com/schirkan/reactron-vrr-departure)
- Calendar (iCal): [reactron-icalendar](https://github.com/schirkan/reactron-icalendar)
- RSS-Feed: [reactron-rss-feed](https://github.com/schirkan/reactron-rss-feed)

### License
MIT

### Inspired by
https://github.com/natergj/dynamic-react-module
https://github.com/MichMich/MagicMirror
