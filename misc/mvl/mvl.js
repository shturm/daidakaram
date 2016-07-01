var fs = require('fs'),
	pd = require('pretty-data').pd,
	_  = require('lodash');

var data = [],
	ccPattern = new RegExp('\\d+ccm','i'),
	kwPattern = new RegExp(' \\d+kw','i'),
	dashPattern = '-- ',
	goodMakes = [
		'Alfa Romeo', 'Alpina', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Chrysler', 'Citroën', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'GAZ', 'GREAT WALL', 'Honda', 'Hyundai', 'Infiniti', 'Isuzu', 'Iveco', 'Jaguar', 'Jeep', 'Kia', 'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Maybach', 'Mazda', 'Mclaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Moskvich', 'Nissan', 'Peugeot', 'Pontiac', 'Porsche', 'Ranger', 'Renault', 'Rolls-Royce', 'Rover', 'Saab', 'Seat', 'Shelby', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Trabant', 'UAZ', 'Vauxhall', 'Volvo', 'VW', 'Wartburg', 'Zastava', 'ZAZ'
	],
	bodies = {
		'Convertible': 'Кабрио',
		'Hatchback': 'Хечбек',
		'Coupe': 'Купе',
		'Saloon': 'Седан',
		'SUV': 'Джип',
		'Targa': 'Кабриолет',
		'Estate': 'Комби',
		'Bus': 'Автобус',
		'Box': 'Баничарка',
		'Platform/Chassis': 'Без Купе',
		'SUV (Open)': 'Отворен Джип',
		'Special Design': 'Специален дизайн',
		'Pickup': 'Пикап',
		'MPV': 'MPV',
		'Box / Estate': 'Баничарка/Комби',
		'Dumptruck': 'Карго',
		'Truck Tractor': 'Трактор',
		'General Purpose Vehicle': 'За общи цели',
		'Cab with Engine' : 'Отворено купе'
	},
	fuels = {
		"Petrol": "Бензин",
		"Diesel": "Дизел",
		"--": "неизвестно гориво",
		"Bi-Fuel": "Хибрид",
		"LPG": "Втечнен бензинов газ",
		"CNG": "Компресиран природен газ",
		"Flex-Fuel": "Флекс",
		"Hybrid": "Хибрид",
		"Petrol/Ethanol": "Бензин/Етанол",
		"Electric": "Електрически",
		"Gas": "Газ",
		"Natural Gas": "Природен газ",
		"Hydrogen": "Водород",
		"Mixture": "Смесено гориво",
	},
	bodyPattern = new RegExp(_.keys(bodies).join('|'),'i');

var translateBody = function (body) {
	return bodies[body];
}
var translateEngine = function (engine) {
	_.each(fuels, function(index, fuel) {
		engine = engine.replace(fuel, fuels[fuel]);
	});

	return engine;
}

fs.readFile('mvl-filtered.csv', 'utf-8', function(err, file) {
	if (err) console.log('Error:', err);




	file = file.split("\n");


	// console.log('lines',file.length);

	for (var i = file.length - 1; i >= 0; i--) {


		// if (i !== 0) {
			file[i] = file[i].split('#');
			// console.log(file[i]);
			if (goodMakes.indexOf(file[i][0]) === -1) continue;

			// arg.replace(ccPattern, '') .replace(kwPattern, '') .replace(dashPattern, '')


			data.push({
				make: file[i][0],
				model:file[i][1],
				variant:file[i][2].replace(ccPattern, '').replace(kwPattern, '').replace(dashPattern, '').replace(bodyPattern, '').trim(),
				body: translateBody(file[i][3]),
				type:file[i][4],
				year:file[i][5],
				engine: translateEngine(file[i][6].replace(ccPattern, '').replace(kwPattern, '').replace(dashPattern, '').trim()),
				ktype:file[i][7],
			});
		// }

	};

	var vw = data.filter(function(e) {
		if (e.make == 'VW') return true;
	});

	data = data.reverse();	

	var output = "window.App.Mvl = " + pd.json(data);
	
	console.log(output);
	// console.log(data.slice(0,1));
});
