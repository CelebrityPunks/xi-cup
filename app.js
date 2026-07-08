(function () {
  "use strict";

  var STORAGE_KEY = "xi-cup-state-v1";
  var ENABLE_SAVED_TEAMS = false;
  var ENABLE_LEAGUE = false;
  var BOT_COUNT = 50;
  var FREE_REROLLS = 2;
  var MANAGER_LINK_PLAYER_CAP = 3;
  var PLAYER_IMAGE_DIR = "assets/players/";
  var MANAGER_IMAGE_DIR = "assets/managers/";
  var VERIFIED_PLAYER_IMAGE_MAX_ID = 240;
  var VERIFIED_PLAYER_IMAGE_IDS = buildIdRange(VERIFIED_PLAYER_IMAGE_MAX_ID);
  var verifiedPlayerImageIdSet = VERIFIED_PLAYER_IMAGE_IDS.reduce(function (acc, id) {
    acc[id] = true;
    return acc;
  }, {});
  var BOT_NAME_PREFIXES = ["Atlas", "Crown", "Metro", "Harbor", "Summit", "Riviera", "Olympic", "Royal", "Union", "Apex", "Liberty", "Capital", "Coastal", "Iron", "Nova", "Vanguard", "Meridian", "Victory"];
  var BOT_NAME_SUFFIXES = ["FC", "United", "Athletic", "Rovers", "City", "SC", "Wanderers", "Dynasty", "Sporting", "Legends", "Eleven", "Strikers", "Guardians", "Borough", "Academy", "Royals", "Stars", "Rangers"];

  var POS_GROUPS = {
    GK: ["GK"],
    DEF: ["CB", "LB", "RB", "LWB", "RWB"],
    MID: ["CDM", "CM", "CAM", "LM", "RM"],
    ATT: ["LW", "RW", "ST", "CF"]
  };

  var players = [
    p(1, "Lionel Messi", 100, "RW", ["CF", "CAM"], "Argentina", ["Barcelona", "PSG", "Inter Miami"], ["2009-2012", "MSN", "tiki-taka"], ["tiki", "msn", "argentina22"], "S"),
    p(2, "Cristiano Ronaldo", 99, "LW", ["ST", "RW"], "Portugal", ["Manchester United", "Real Madrid", "Juventus"], ["2008", "2016-2018", "counter"], ["galactico", "united08"], "S"),
    p(3, "Ronaldo Nazario", 97, "ST", ["CF"], "Brazil", ["Barcelona", "Inter", "Real Madrid"], ["1998", "2002"], ["brazil02", "galactico"], "S"),
    p(4, "Zinedine Zidane", 97, "CAM", ["CM"], "France", ["Juventus", "Real Madrid"], ["1998", "2002"], ["galactico", "france98"], "S"),
    p(5, "Pele", 98, "CF", ["ST", "CAM"], "Brazil", ["Santos", "Brazil"], ["1970"], ["brazil70"], "S"),
    p(6, "Diego Maradona", 98, "CAM", ["CF", "LW"], "Argentina", ["Napoli", "Barcelona"], ["1986"], ["classic10"], "S"),
    p(7, "Neymar", 95, "LW", ["CAM", "RW"], "Brazil", ["Barcelona", "PSG"], ["2015", "MSN"], ["msn", "brazil"], "A"),
    p(8, "Luis Suarez", 95, "ST", ["CF"], "Uruguay", ["Liverpool", "Barcelona", "Atletico Madrid"], ["2014", "MSN"], ["msn"], "A"),
    p(9, "Xavi", 96, "CM", ["CDM"], "Spain", ["Barcelona"], ["2009-2012", "Spain 2010", "tiki-taka"], ["tiki", "spain10"], "S"),
    p(10, "Andres Iniesta", 96, "CM", ["CAM", "LW"], "Spain", ["Barcelona"], ["2009-2012", "Spain 2010", "tiki-taka"], ["tiki", "spain10"], "S"),
    p(11, "Sergio Busquets", 93, "CDM", ["CM"], "Spain", ["Barcelona"], ["2009-2012", "Spain 2010", "tiki-taka"], ["tiki", "spain10"], "A"),
    p(12, "Dani Alves", 94, "RB", ["RWB"], "Brazil", ["Barcelona", "Juventus", "PSG"], ["2009-2012", "tiki-taka"], ["tiki", "brazil"], "A"),
    p(13, "Carles Puyol", 94, "CB", ["RB"], "Spain", ["Barcelona"], ["2009-2012", "Spain 2010"], ["tiki", "spain10"], "A"),
    p(14, "Gerard Pique", 92, "CB", [], "Spain", ["Barcelona", "Manchester United"], ["2009-2012", "Spain 2010"], ["tiki", "spain10"], "B"),
    p(15, "David Villa", 93, "ST", ["LW"], "Spain", ["Valencia", "Barcelona", "Atletico Madrid"], ["Spain 2010"], ["spain10", "tiki"], "A"),
    p(16, "Iker Casillas", 95, "GK", [], "Spain", ["Real Madrid", "Porto"], ["Spain 2010", "2016-2018"], ["spain10", "galactico"], "S"),
    p(17, "Sergio Ramos", 94, "CB", ["RB"], "Spain", ["Real Madrid", "PSG"], ["Spain 2010", "2016-2018"], ["galactico", "spain10"], "S"),
    p(18, "Luka Modric", 95, "CM", ["CAM"], "Croatia", ["Real Madrid", "Tottenham"], ["2016-2018"], ["galactico"], "S"),
    p(19, "Toni Kroos", 93, "CM", ["CDM"], "Germany", ["Bayern Munich", "Real Madrid"], ["2014", "2016-2018"], ["galactico", "germany14"], "A"),
    p(20, "Karim Benzema", 94, "ST", ["CF"], "France", ["Lyon", "Real Madrid"], ["2016-2018"], ["galactico", "france"], "A"),
    p(21, "Gareth Bale", 92, "RW", ["LW", "ST"], "Wales", ["Tottenham", "Real Madrid"], ["2016-2018"], ["galactico"], "A"),
    p(22, "Marcelo", 92, "LB", ["LWB"], "Brazil", ["Real Madrid"], ["2016-2018"], ["galactico", "brazil"], "A"),
    p(23, "Casemiro", 91, "CDM", ["CM"], "Brazil", ["Real Madrid", "Manchester United"], ["2016-2018"], ["galactico", "brazil"], "B"),
    p(24, "Roberto Carlos", 95, "LB", ["LWB"], "Brazil", ["Real Madrid", "Inter"], ["2002"], ["brazil02", "galactico"], "S"),
    p(25, "Cafu", 94, "RB", ["RWB"], "Brazil", ["Roma", "AC Milan", "Brazil"], ["2002"], ["brazil02", "milan"], "A"),
    p(26, "Ronaldinho", 96, "LW", ["CAM"], "Brazil", ["PSG", "Barcelona", "AC Milan"], ["2002", "2006"], ["brazil02", "tiki"], "S"),
    p(27, "Rivaldo", 94, "CAM", ["LW", "CF"], "Brazil", ["Barcelona", "AC Milan"], ["2002"], ["brazil02"], "A"),
    p(28, "Kaka", 95, "CAM", ["CM"], "Brazil", ["AC Milan", "Real Madrid"], ["2005-2007"], ["milan", "brazil"], "S"),
    p(29, "Dida", 91, "GK", [], "Brazil", ["AC Milan", "Brazil"], ["2002", "2005-2007"], ["brazil02", "milan"], "B"),
    p(30, "Paolo Maldini", 96, "CB", ["LB"], "Italy", ["AC Milan"], ["2005-2007"], ["milan-wall", "milan"], "S"),
    p(31, "Alessandro Nesta", 94, "CB", [], "Italy", ["Lazio", "AC Milan"], ["2005-2007"], ["milan-wall", "milan"], "A"),
    p(32, "Andrea Pirlo", 94, "CM", ["CDM"], "Italy", ["AC Milan", "Juventus"], ["2005-2007"], ["milan", "italy06"], "A"),
    p(33, "Clarence Seedorf", 92, "CM", ["CAM"], "Netherlands", ["Ajax", "Real Madrid", "AC Milan"], ["2005-2007"], ["milan"], "B"),
    p(34, "Andriy Shevchenko", 93, "ST", ["CF"], "Ukraine", ["Dynamo Kyiv", "AC Milan", "Chelsea"], ["2005-2007"], ["milan"], "A"),
    p(35, "Gianluigi Buffon", 95, "GK", [], "Italy", ["Parma", "Juventus", "PSG"], ["2006"], ["italy06"], "S"),
    p(36, "Fabio Cannavaro", 93, "CB", [], "Italy", ["Parma", "Juventus", "Real Madrid"], ["2006"], ["italy06"], "A"),
    p(37, "Thierry Henry", 96, "ST", ["LW"], "France", ["Arsenal", "Barcelona"], ["Invincibles", "2009-2012"], ["arsenal", "tiki", "france"], "S"),
    p(38, "Dennis Bergkamp", 93, "CF", ["CAM", "ST"], "Netherlands", ["Ajax", "Inter", "Arsenal"], ["Invincibles"], ["arsenal"], "A"),
    p(39, "Patrick Vieira", 93, "CM", ["CDM"], "France", ["Arsenal", "Juventus", "Inter"], ["Invincibles", "1998"], ["arsenal", "france98"], "A"),
    p(40, "Robert Pires", 91, "LM", ["LW"], "France", ["Metz", "Marseille", "Arsenal"], ["Invincibles"], ["arsenal", "france"], "B"),
    p(41, "Sol Campbell", 90, "CB", [], "England", ["Tottenham", "Arsenal"], ["Invincibles"], ["arsenal"], "B"),
    p(42, "Ashley Cole", 91, "LB", ["LWB"], "England", ["Arsenal", "Chelsea"], ["Invincibles"], ["arsenal"], "B"),
    p(43, "Peter Schmeichel", 94, "GK", [], "Denmark", ["Manchester United"], ["1999"], ["united"], "A"),
    p(44, "Wayne Rooney", 92, "CF", ["ST", "CAM"], "England", ["Everton", "Manchester United"], ["2008"], ["united08"], "A"),
    p(45, "Rio Ferdinand", 91, "CB", [], "England", ["Leeds", "Manchester United"], ["2008"], ["united08"], "B"),
    p(46, "Nemanja Vidic", 91, "CB", [], "Serbia", ["Spartak Moscow", "Manchester United"], ["2008"], ["united08"], "B"),
    p(47, "Paul Scholes", 92, "CM", ["CAM"], "England", ["Manchester United"], ["1999", "2008"], ["united08", "united"], "A"),
    p(48, "Ryan Giggs", 91, "LM", ["LW"], "Wales", ["Manchester United"], ["1999", "2008"], ["united"], "B"),
    p(49, "Edwin van der Sar", 91, "GK", [], "Netherlands", ["Ajax", "Juventus", "Manchester United"], ["2008"], ["united08"], "B"),
    p(50, "Xabi Alonso", 92, "CDM", ["CM"], "Spain", ["Liverpool", "Real Madrid", "Bayern Munich"], ["Spain 2010", "2016-2018"], ["spain10", "galactico"], "A"),
    p(51, "Manuel Neuer", 94, "GK", [], "Germany", ["Schalke", "Bayern Munich"], ["2014"], ["germany14", "press"], "S"),
    p(52, "Philipp Lahm", 93, "RB", ["LB", "CDM"], "Germany", ["Bayern Munich"], ["2014"], ["germany14"], "A"),
    p(53, "Bastian Schweinsteiger", 92, "CM", ["CDM"], "Germany", ["Bayern Munich", "Manchester United"], ["2014"], ["germany14"], "A"),
    p(54, "Thomas Muller", 91, "CF", ["CAM", "RW"], "Germany", ["Bayern Munich"], ["2014"], ["germany14", "press"], "B"),
    p(55, "Miroslav Klose", 90, "ST", ["CF"], "Germany", ["Werder Bremen", "Bayern Munich", "Lazio"], ["2014"], ["germany14"], "B"),
    p(56, "Mesut Ozil", 91, "CAM", ["RW"], "Germany", ["Werder Bremen", "Real Madrid", "Arsenal"], ["2014"], ["germany14", "arsenal"], "B"),
    p(57, "Kevin De Bruyne", 94, "CM", ["CAM", "RM"], "Belgium", ["Chelsea", "Wolfsburg", "Manchester City"], ["2023"], ["city23"], "S"),
    p(58, "Erling Haaland", 94, "ST", ["CF"], "Norway", ["Dortmund", "Manchester City"], ["2023"], ["city23"], "S"),
    p(59, "Rodri", 93, "CDM", ["CM"], "Spain", ["Atletico Madrid", "Manchester City"], ["2023"], ["city23", "spain"], "A"),
    p(60, "Bernardo Silva", 91, "RM", ["CM", "RW"], "Portugal", ["Monaco", "Manchester City"], ["2023"], ["city23", "press"], "B"),
    p(61, "Ruben Dias", 90, "CB", [], "Portugal", ["Benfica", "Manchester City"], ["2023"], ["city23"], "B"),
    p(62, "Ederson", 90, "GK", [], "Brazil", ["Benfica", "Manchester City"], ["2023"], ["city23", "brazil"], "B"),
    p(63, "Johan Cruyff", 97, "CF", ["CAM", "RW"], "Netherlands", ["Ajax", "Barcelona"], ["1974"], ["total-football"], "S"),
    p(64, "Ruud Gullit", 94, "CAM", ["CM", "CF"], "Netherlands", ["PSV", "AC Milan", "Chelsea"], ["1988"], ["total-football", "milan"], "A"),
    p(65, "Marco van Basten", 95, "ST", ["CF"], "Netherlands", ["Ajax", "AC Milan"], ["1988"], ["total-football", "milan"], "S"),
    p(66, "Frank Rijkaard", 93, "CDM", ["CB"], "Netherlands", ["Ajax", "AC Milan"], ["1988"], ["total-football", "milan"], "A"),
    p(67, "Virgil van Dijk", 92, "CB", [], "Netherlands", ["Southampton", "Liverpool"], ["2019"], ["press", "liverpool"], "A"),
    p(68, "Mohamed Salah", 93, "RW", ["ST"], "Egypt", ["Roma", "Liverpool"], ["2019"], ["press", "liverpool"], "A"),
    p(69, "Sadio Mane", 92, "LW", ["ST"], "Senegal", ["Southampton", "Liverpool", "Bayern Munich"], ["2019"], ["press", "liverpool"], "A"),
    p(70, "Roberto Firmino", 90, "CF", ["ST", "CAM"], "Brazil", ["Hoffenheim", "Liverpool"], ["2019"], ["press", "liverpool", "brazil"], "B"),
    p(71, "Alisson", 91, "GK", [], "Brazil", ["Roma", "Liverpool"], ["2019"], ["press", "liverpool", "brazil"], "B"),
    p(72, "Steven Gerrard", 93, "CM", ["CAM", "CDM"], "England", ["Liverpool", "LA Galaxy"], ["2005"], ["liverpool"], "A"),
    p(73, "Frank Lampard", 92, "CM", ["CAM"], "England", ["West Ham", "Chelsea", "Manchester City"], ["2005"], ["chelsea"], "A"),
    p(74, "Didier Drogba", 91, "ST", ["CF"], "Ivory Coast", ["Marseille", "Chelsea"], ["2012"], ["chelsea"], "A"),
    p(75, "John Terry", 91, "CB", [], "England", ["Chelsea"], ["2012"], ["chelsea"], "B"),
    p(76, "Petr Cech", 92, "GK", [], "Czech Republic", ["Chelsea", "Arsenal"], ["2012"], ["chelsea", "arsenal"], "A"),
    p(77, "Kylian Mbappe", 95, "ST", ["LW", "RW"], "France", ["Monaco", "PSG", "Real Madrid"], ["2018", "2022"], ["france", "speed"], "S"),
    p(78, "Antoine Griezmann", 91, "CF", ["CAM", "RW"], "France", ["Real Sociedad", "Atletico Madrid", "Barcelona"], ["2018"], ["france"], "B"),
    p(79, "N'Golo Kante", 92, "CDM", ["CM"], "France", ["Leicester", "Chelsea"], ["2018"], ["france", "chelsea"], "A"),
    p(80, "Raphael Varane", 90, "CB", [], "France", ["Real Madrid", "Manchester United"], ["2018"], ["france", "galactico"], "B"),
    p(81, "Hugo Lloris", 89, "GK", [], "France", ["Lyon", "Tottenham"], ["2018"], ["france"], "B"),
    p(82, "Angel Di Maria", 90, "RW", ["LW", "CAM"], "Argentina", ["Real Madrid", "Manchester United", "PSG", "Juventus"], ["2014", "2022"], ["argentina22", "galactico"], "B"),
    p(83, "Emiliano Martinez", 88, "GK", [], "Argentina", ["Arsenal", "Aston Villa"], ["2022"], ["argentina22"], "B"),
    p(84, "Enzo Fernandez", 87, "CM", ["CDM"], "Argentina", ["River Plate", "Benfica", "Chelsea"], ["2022"], ["argentina22"], "C"),
    p(85, "Julian Alvarez", 88, "ST", ["CF", "RW"], "Argentina", ["River Plate", "Manchester City", "Atletico Madrid"], ["2022", "2023"], ["argentina22", "city23"], "B"),
    p(86, "Vinicius Junior", 93, "LW", ["RW"], "Brazil", ["Flamengo", "Real Madrid"], ["2022"], ["galactico", "brazil"], "A"),
    p(87, "Jude Bellingham", 92, "CAM", ["CM"], "England", ["Birmingham", "Dortmund", "Real Madrid"], ["2024"], ["galactico"], "A"),
    p(88, "Harry Kane", 92, "ST", ["CF"], "England", ["Tottenham", "Bayern Munich"], ["2020"], ["england"], "A"),
    p(89, "Son Heung-min", 91, "LW", ["ST", "RW"], "South Korea", ["Hamburg", "Leverkusen", "Tottenham"], ["2020"], ["speed"], "B"),
    p(90, "Yaya Toure", 91, "CM", ["CDM", "CAM"], "Ivory Coast", ["Barcelona", "Manchester City"], ["2012"], ["city", "tiki"], "B"),
    p(91, "Lev Yashin", 96, "GK", [], "Soviet Union", ["Dynamo Moscow"], ["1963"], ["classic", "keeper"], "S"),
    p(92, "Franz Beckenbauer", 97, "CB", ["CDM", "CM"], "Germany", ["Bayern Munich", "New York Cosmos"], ["1974"], ["germany74", "classic"], "S"),
    p(93, "Gerd Muller", 95, "ST", ["CF"], "Germany", ["Bayern Munich"], ["1974"], ["germany74", "bayern"], "S"),
    p(94, "Lothar Matthaus", 95, "CM", ["CDM", "CB"], "Germany", ["Borussia Monchengladbach", "Bayern Munich", "Inter"], ["1990"], ["germany90", "inter"], "S"),
    p(95, "Oliver Kahn", 94, "GK", [], "Germany", ["Karlsruhe", "Bayern Munich"], ["2001"], ["bayern", "keeper"], "A"),
    p(96, "Roberto Baggio", 94, "CF", ["CAM", "ST"], "Italy", ["Fiorentina", "Juventus", "AC Milan", "Inter"], ["1994"], ["italy", "classic10"], "A"),
    p(97, "Francesco Totti", 93, "CAM", ["CF", "ST"], "Italy", ["Roma"], ["2006"], ["italy06"], "A"),
    p(98, "Alessandro Del Piero", 93, "CF", ["ST", "LW"], "Italy", ["Juventus"], ["2006"], ["italy06"], "A"),
    p(99, "Javier Zanetti", 92, "RB", ["RWB", "CM"], "Argentina", ["Inter"], ["2010"], ["inter10", "argentina"], "A"),
    p(100, "Wesley Sneijder", 92, "CAM", ["CM"], "Netherlands", ["Ajax", "Real Madrid", "Inter"], ["2010"], ["inter10", "netherlands"], "A"),
    p(101, "Samuel Eto'o", 94, "ST", ["RW"], "Cameroon", ["Barcelona", "Inter", "Chelsea"], ["2009", "2010"], ["inter10", "tiki"], "A"),
    p(102, "Diego Milito", 91, "ST", ["CF"], "Argentina", ["Genoa", "Inter"], ["2010"], ["inter10", "argentina"], "B"),
    p(103, "Lucio", 91, "CB", [], "Brazil", ["Bayer Leverkusen", "Bayern Munich", "Inter"], ["2010"], ["inter10", "brazil"], "B"),
    p(104, "Maicon", 91, "RB", ["RWB"], "Brazil", ["Monaco", "Inter", "Roma"], ["2010"], ["inter10", "brazil"], "B"),
    p(105, "Julio Cesar", 91, "GK", [], "Brazil", ["Flamengo", "Inter"], ["2010"], ["inter10", "brazil"], "B"),
    p(106, "Arjen Robben", 94, "RW", ["LW"], "Netherlands", ["PSV", "Chelsea", "Real Madrid", "Bayern Munich"], ["2013"], ["bayern13", "netherlands"], "A"),
    p(107, "Franck Ribery", 93, "LW", ["LM", "CAM"], "France", ["Marseille", "Bayern Munich"], ["2013"], ["bayern13", "france"], "A"),
    p(108, "Robert Lewandowski", 96, "ST", ["CF"], "Poland", ["Lech Poznan", "Dortmund", "Bayern Munich", "Barcelona"], ["2020"], ["bayern20", "bayern"], "S"),
    p(109, "David Alaba", 90, "LB", ["CB", "CM"], "Austria", ["Bayern Munich", "Real Madrid"], ["2013", "2020"], ["bayern13", "bayern20"], "B"),
    p(110, "Jerome Boateng", 90, "CB", [], "Germany", ["Hamburg", "Manchester City", "Bayern Munich"], ["2013", "2014"], ["bayern13", "germany14"], "B"),
    p(111, "Mats Hummels", 90, "CB", [], "Germany", ["Dortmund", "Bayern Munich"], ["2014"], ["germany14", "dortmund"], "B"),
    p(112, "Mario Gotze", 89, "CAM", ["CF", "RW"], "Germany", ["Dortmund", "Bayern Munich", "PSV"], ["2014"], ["germany14", "dortmund"], "B"),
    p(113, "Marco Reus", 90, "LW", ["CAM", "ST"], "Germany", ["Borussia Monchengladbach", "Dortmund"], ["2013"], ["dortmund"], "B"),
    p(114, "Sergio Aguero", 94, "ST", ["CF"], "Argentina", ["Independiente", "Atletico Madrid", "Manchester City", "Barcelona"], ["2012"], ["city", "argentina"], "A"),
    p(115, "David Silva", 93, "CAM", ["CM", "LM"], "Spain", ["Valencia", "Manchester City", "Real Sociedad"], ["2012"], ["city", "spain"], "A"),
    p(116, "Vincent Kompany", 90, "CB", [], "Belgium", ["Anderlecht", "Hamburg", "Manchester City"], ["2012"], ["city", "belgium"], "B"),
    p(117, "Joe Hart", 87, "GK", [], "England", ["Manchester City", "Torino", "Tottenham", "Celtic"], ["2012"], ["city", "england"], "C"),
    p(118, "Eden Hazard", 93, "LW", ["CAM", "RW"], "Belgium", ["Lille", "Chelsea", "Real Madrid"], ["2017"], ["chelsea", "belgium"], "A"),
    p(119, "Cesc Fabregas", 92, "CM", ["CAM", "CDM"], "Spain", ["Arsenal", "Barcelona", "Chelsea"], ["2010"], ["spain10", "arsenal", "chelsea"], "A"),
    p(120, "Michael Ballack", 91, "CM", ["CDM", "CAM"], "Germany", ["Bayer Leverkusen", "Bayern Munich", "Chelsea"], ["2002"], ["germany", "chelsea"], "B"),
    p(121, "Claude Makelele", 92, "CDM", ["CM"], "France", ["Nantes", "Marseille", "Celta Vigo", "Real Madrid", "Chelsea", "PSG"], ["2005"], ["chelsea", "france", "galactico"], "A"),
    p(122, "Marcel Desailly", 92, "CB", ["CDM"], "France", ["Marseille", "AC Milan", "Chelsea"], ["1998"], ["france98", "milan"], "A"),
    p(123, "Lilian Thuram", 92, "RB", ["CB"], "France", ["Monaco", "Parma", "Juventus", "Barcelona"], ["1998"], ["france98"], "A"),
    p(124, "Laurent Blanc", 90, "CB", [], "France", ["Montpellier", "Barcelona", "Marseille", "Inter", "Manchester United"], ["1998"], ["france98", "united"], "B"),
    p(125, "Youri Djorkaeff", 89, "CAM", ["CF"], "France", ["Monaco", "PSG", "Inter", "Kaiserslautern"], ["1998"], ["france98", "inter"], "B"),
    p(126, "David Beckham", 92, "RM", ["CM", "RW"], "England", ["Manchester United", "Real Madrid", "LA Galaxy", "AC Milan", "PSG"], ["1999"], ["united", "galactico", "england"], "A"),
    p(127, "Roy Keane", 92, "CM", ["CDM"], "Ireland", ["Nottingham Forest", "Manchester United", "Celtic"], ["1999"], ["united"], "A"),
    p(128, "Jaap Stam", 91, "CB", [], "Netherlands", ["PSV", "Manchester United", "Lazio", "AC Milan"], ["1999"], ["united", "milan"], "B"),
    p(129, "Dwight Yorke", 89, "ST", ["CF"], "Trinidad and Tobago", ["Aston Villa", "Manchester United"], ["1999"], ["united"], "B"),
    p(130, "Andy Cole", 89, "ST", ["CF"], "England", ["Newcastle", "Manchester United", "Blackburn"], ["1999"], ["united", "england"], "B"),
    p(131, "Michael Owen", 90, "ST", ["CF"], "England", ["Liverpool", "Real Madrid", "Newcastle", "Manchester United"], ["2001"], ["liverpool", "england"], "B"),
    p(132, "Fernando Torres", 92, "ST", ["CF"], "Spain", ["Atletico Madrid", "Liverpool", "Chelsea", "AC Milan"], ["2008", "Spain 2010"], ["spain10", "liverpool", "chelsea"], "A"),
    p(133, "David De Gea", 90, "GK", [], "Spain", ["Atletico Madrid", "Manchester United", "Fiorentina"], ["2018"], ["united", "spain"], "B"),
    p(134, "Trent Alexander-Arnold", 89, "RB", ["RWB", "CM"], "England", ["Liverpool"], ["2019"], ["press", "liverpool", "england"], "B"),
    p(135, "Andrew Robertson", 88, "LB", ["LWB"], "Scotland", ["Hull City", "Liverpool"], ["2019"], ["press", "liverpool"], "B"),
    p(136, "Fabinho", 89, "CDM", ["CB"], "Brazil", ["Monaco", "Liverpool", "Al-Ittihad"], ["2019"], ["press", "liverpool", "brazil"], "B"),
    p(137, "Jordan Henderson", 88, "CM", ["CDM"], "England", ["Sunderland", "Liverpool"], ["2019"], ["press", "liverpool", "england"], "B"),
    p(138, "Romario", 96, "ST", ["CF"], "Brazil", ["Vasco da Gama", "PSV", "Barcelona", "Flamengo"], ["1994"], ["brazil94", "classic"], "S"),
    p(139, "Bebeto", 90, "ST", ["CF"], "Brazil", ["Flamengo", "Vasco da Gama", "Deportivo La Coruna"], ["1994"], ["brazil94"], "B"),
    p(140, "Dunga", 89, "CDM", ["CM"], "Brazil", ["Internacional", "Fiorentina", "Stuttgart"], ["1994"], ["brazil94"], "B"),
    p(141, "Claudio Taffarel", 89, "GK", [], "Brazil", ["Internacional", "Parma", "Galatasaray"], ["1994"], ["brazil94", "keeper"], "B"),
    p(142, "Hristo Stoichkov", 93, "LW", ["ST", "RW"], "Bulgaria", ["CSKA Sofia", "Barcelona", "Parma"], ["1994"], ["dream-team"], "A"),
    p(143, "Michael Laudrup", 93, "CAM", ["CM", "CF"], "Denmark", ["Juventus", "Barcelona", "Real Madrid", "Ajax"], ["1992"], ["dream-team", "classic"], "A"),
    p(144, "Ronald Koeman", 91, "CB", ["CDM"], "Netherlands", ["Ajax", "PSV", "Barcelona"], ["1992"], ["dream-team", "netherlands"], "A"),
    p(145, "Luis Figo", 94, "RW", ["RM"], "Portugal", ["Sporting CP", "Barcelona", "Real Madrid", "Inter"], ["2000"], ["galactico", "portugal"], "S"),
    p(146, "Deco", 91, "CM", ["CAM"], "Portugal", ["Porto", "Barcelona", "Chelsea"], ["2004"], ["portugal", "tiki"], "A"),
    p(147, "Rui Costa", 90, "CAM", ["CM"], "Portugal", ["Benfica", "Fiorentina", "AC Milan"], ["2004"], ["portugal", "milan"], "B"),
    p(148, "Pepe", 90, "CB", [], "Portugal", ["Porto", "Real Madrid", "Besiktas"], ["2016"], ["portugal", "galactico"], "B"),
    p(149, "Joao Moutinho", 88, "CM", ["CDM"], "Portugal", ["Sporting CP", "Porto", "Monaco", "Wolves"], ["2016"], ["portugal"], "C"),
    p(150, "Eusebio", 96, "ST", ["CF"], "Portugal", ["Benfica"], ["1966"], ["portugal", "classic"], "S"),
    p(151, "Ferenc Puskas", 97, "ST", ["CF"], "Hungary", ["Honved", "Real Madrid"], ["1954"], ["galactico", "classic"], "S"),
    p(152, "Alfredo Di Stefano", 97, "CF", ["ST", "CM"], "Argentina", ["River Plate", "Millonarios", "Real Madrid"], ["1950s"], ["galactico", "classic"], "S"),
    p(153, "Garrincha", 96, "RW", ["RM"], "Brazil", ["Botafogo"], ["1962"], ["brazil", "classic"], "S"),
    p(154, "Bobby Charlton", 95, "CAM", ["CM"], "England", ["Manchester United"], ["1966"], ["united", "england", "classic"], "S"),
    p(155, "Bobby Moore", 94, "CB", [], "England", ["West Ham", "Fulham"], ["1966"], ["england", "classic"], "A"),
    p(156, "Gordon Banks", 92, "GK", [], "England", ["Leicester City", "Stoke City"], ["1966"], ["england", "keeper"], "A"),
    p(157, "Gary Lineker", 89, "ST", ["CF"], "England", ["Leicester City", "Everton", "Barcelona", "Tottenham"], ["1986"], ["england"], "B"),
    p(158, "Paul Gascoigne", 90, "CAM", ["CM"], "England", ["Newcastle", "Tottenham", "Lazio", "Rangers"], ["1990"], ["england"], "B"),
    p(159, "Ousmane Dembele", 96, "RW", ["LW", "CF"], "France", ["Rennes", "Dortmund", "Barcelona", "PSG"], ["2025"], ["psg25", "france", "speed"], "S"),
    p(160, "Lamine Yamal", 95, "RW", ["LW", "CAM"], "Spain", ["Barcelona"], ["2025"], ["barca25", "spain", "nextgen"], "S"),
    p(161, "Vitinha", 92, "CM", ["CDM", "CAM"], "Portugal", ["Porto", "PSG"], ["2025"], ["psg25", "portugal"], "A"),
    p(162, "Raphinha", 92, "RW", ["LW", "RM"], "Brazil", ["Leeds", "Barcelona"], ["2025"], ["barca25", "brazil"], "A"),
    p(163, "Achraf Hakimi", 91, "RB", ["RWB", "RM"], "Morocco", ["Real Madrid", "Dortmund", "Inter", "PSG"], ["2025"], ["psg25", "morocco"], "A"),
    p(164, "Nuno Mendes", 89, "LB", ["LWB"], "Portugal", ["Sporting CP", "PSG"], ["2025"], ["psg25", "portugal"], "B"),
    p(165, "Desire Doue", 86, "CAM", ["LW", "RW"], "France", ["Rennes", "PSG"], ["2025"], ["psg25", "france", "nextgen"], "B"),
    p(166, "Viktor Gyokeres", 90, "ST", ["CF"], "Sweden", ["Coventry City", "Sporting CP"], ["2025"], ["sporting", "power-forward"], "A"),
    p(167, "Khvicha Kvaratskhelia", 91, "LW", ["RW", "CAM"], "Georgia", ["Dinamo Batumi", "Napoli", "PSG"], ["2023", "2025"], ["napoli23", "psg25"], "A"),
    p(168, "Gianluigi Donnarumma", 92, "GK", [], "Italy", ["AC Milan", "PSG"], ["2021", "2025"], ["psg25", "italy", "keeper"], "A"),
    p(169, "Pedri", 91, "CM", ["CAM"], "Spain", ["Las Palmas", "Barcelona"], ["2025"], ["barca25", "spain"], "A"),
    p(170, "Cole Palmer", 91, "CAM", ["RW", "CF"], "England", ["Manchester City", "Chelsea"], ["2025"], ["chelsea25", "england"], "A"),
    p(171, "Lautaro Martinez", 91, "ST", ["CF"], "Argentina", ["Racing Club", "Inter"], ["2024"], ["inter25", "argentina"], "A"),
    p(172, "Alexis Mac Allister", 88, "CM", ["CDM", "CAM"], "Argentina", ["Brighton", "Liverpool"], ["2022", "2025"], ["liverpool25", "argentina22"], "B"),
    p(173, "Florian Wirtz", 92, "CAM", ["CM", "LW"], "Germany", ["Bayer Leverkusen", "Liverpool"], ["2024", "2025"], ["leverkusen24", "liverpool25", "germany"], "A"),
    p(174, "Jamal Musiala", 91, "CAM", ["LW", "CM"], "Germany", ["Chelsea", "Bayern Munich"], ["2024"], ["bayern", "germany"], "A"),
    p(175, "Bukayo Saka", 90, "RW", ["RM", "LW"], "England", ["Arsenal"], ["2024"], ["arsenal25", "england"], "A"),
    p(176, "Martin Odegaard", 90, "CAM", ["CM"], "Norway", ["Real Madrid", "Real Sociedad", "Arsenal"], ["2024"], ["arsenal25"], "A"),
    p(177, "Declan Rice", 89, "CDM", ["CM"], "England", ["West Ham", "Arsenal"], ["2024"], ["arsenal25", "england"], "A"),
    p(178, "William Saliba", 88, "CB", [], "France", ["Saint-Etienne", "Arsenal", "Marseille"], ["2024"], ["arsenal25", "france"], "B"),
    p(179, "Gabriel Magalhaes", 87, "CB", [], "Brazil", ["Lille", "Arsenal"], ["2024"], ["arsenal25", "brazil"], "B"),
    p(180, "Federico Valverde", 90, "CM", ["RM", "CDM"], "Uruguay", ["Penarol", "Real Madrid"], ["2024"], ["madrid25", "galactico"], "A"),
    p(181, "Aurelien Tchouameni", 88, "CDM", ["CM", "CB"], "France", ["Bordeaux", "Monaco", "Real Madrid"], ["2024"], ["madrid25", "france"], "B"),
    p(182, "Eduardo Camavinga", 87, "CM", ["CDM", "LB"], "France", ["Rennes", "Real Madrid"], ["2024"], ["madrid25", "france"], "B"),
    p(183, "Rodrygo", 89, "RW", ["LW", "ST"], "Brazil", ["Santos", "Real Madrid"], ["2024"], ["madrid25", "brazil"], "B"),
    p(184, "Dani Carvajal", 89, "RB", ["RWB"], "Spain", ["Real Madrid", "Bayer Leverkusen"], ["2024"], ["madrid25", "spain"], "B"),
    p(185, "Thibaut Courtois", 92, "GK", [], "Belgium", ["Genk", "Chelsea", "Atletico Madrid", "Real Madrid"], ["2022", "2024"], ["madrid25", "belgium", "keeper"], "A"),
    p(186, "Jan Oblak", 90, "GK", [], "Slovenia", ["Benfica", "Atletico Madrid"], ["2021"], ["atleti", "keeper"], "A"),
    p(187, "Mike Maignan", 89, "GK", [], "France", ["Lille", "AC Milan"], ["2022"], ["milan", "france", "keeper"], "B"),
    p(188, "Nicolo Barella", 89, "CM", ["RM"], "Italy", ["Cagliari", "Inter"], ["2024"], ["inter25", "italy"], "B"),
    p(189, "Alessandro Bastoni", 88, "CB", [], "Italy", ["Atalanta", "Parma", "Inter"], ["2024"], ["inter25", "italy"], "B"),
    p(190, "Federico Dimarco", 87, "LWB", ["LB", "LM"], "Italy", ["Inter", "Parma", "Verona"], ["2024"], ["inter25", "italy"], "B"),
    p(191, "Hakan Calhanoglu", 88, "CDM", ["CM", "CAM"], "Turkey", ["Hamburg", "Bayer Leverkusen", "AC Milan", "Inter"], ["2024"], ["inter25"], "B"),
    p(192, "Victor Osimhen", 91, "ST", ["CF"], "Nigeria", ["Lille", "Napoli", "Galatasaray"], ["2023", "2025"], ["napoli23", "power-forward"], "A"),
    p(193, "Ademola Lookman", 88, "LW", ["ST", "RW"], "Nigeria", ["Everton", "RB Leipzig", "Leicester City", "Atalanta"], ["2024"], ["atalanta24"], "B"),
    p(194, "Alexander Isak", 90, "ST", ["CF"], "Sweden", ["AIK", "Dortmund", "Real Sociedad", "Newcastle"], ["2025"], ["newcastle", "sweden"], "A"),
    p(195, "Bruno Fernandes", 90, "CAM", ["CM"], "Portugal", ["Sporting CP", "Manchester United"], ["2024"], ["united", "portugal"], "A"),
    p(196, "Rafael Leao", 89, "LW", ["ST"], "Portugal", ["Sporting CP", "Lille", "AC Milan"], ["2022"], ["milan", "portugal"], "B"),
    p(197, "Joao Neves", 86, "CDM", ["CM"], "Portugal", ["Benfica", "PSG"], ["2025"], ["psg25", "portugal", "nextgen"], "B"),
    p(198, "Warren Zaire-Emery", 86, "CM", ["CDM"], "France", ["PSG"], ["2025"], ["psg25", "france", "nextgen"], "B"),
    p(199, "Endrick", 84, "ST", ["RW"], "Brazil", ["Palmeiras", "Real Madrid"], ["2025"], ["madrid25", "brazil", "nextgen"], "C"),
    p(200, "Estevao", 84, "RW", ["LW", "CAM"], "Brazil", ["Palmeiras", "Chelsea"], ["2025"], ["chelsea25", "brazil", "nextgen"], "C"),
    p(201, "Patrice Evra", 90, "LB", ["LWB"], "France", ["Monaco", "Manchester United", "Juventus"], ["2008"], ["united08", "france"], "B"),
    p(202, "Gianluca Zambrotta", 91, "RB", ["LB", "RWB", "LWB"], "Italy", ["Juventus", "Barcelona", "AC Milan"], ["2006"], ["italy06", "milan"], "A"),
    p(203, "Joao Cancelo", 90, "RB", ["LB", "RWB", "LWB"], "Portugal", ["Benfica", "Valencia", "Juventus", "Manchester City", "Barcelona"], ["2023"], ["city23", "portugal"], "A"),
    p(204, "Kyle Walker", 89, "RB", ["RWB", "CB"], "England", ["Tottenham", "Manchester City"], ["2023"], ["city23", "england"], "B"),
    p(205, "Reece James", 87, "RB", ["RWB", "RM"], "England", ["Chelsea"], ["2021"], ["chelsea", "england"], "B"),
    p(206, "Jeremie Frimpong", 88, "RWB", ["RB", "RM"], "Netherlands", ["Celtic", "Bayer Leverkusen", "Liverpool"], ["2024", "2025"], ["leverkusen24", "liverpool25"], "B"),
    p(207, "Denzel Dumfries", 87, "RWB", ["RB", "RM"], "Netherlands", ["PSV", "Inter"], ["2024"], ["inter25", "netherlands"], "B"),
    p(208, "Kieran Trippier", 86, "RB", ["RWB", "RM"], "England", ["Tottenham", "Atletico Madrid", "Newcastle"], ["2021"], ["england", "atleti"], "C"),
    p(209, "Theo Hernandez", 90, "LB", ["LWB", "LM"], "France", ["Atletico Madrid", "Real Madrid", "AC Milan"], ["2022"], ["milan", "france"], "A"),
    p(210, "Alphonso Davies", 89, "LB", ["LWB", "LW"], "Canada", ["Vancouver Whitecaps", "Bayern Munich"], ["2020"], ["bayern20", "speed"], "B"),
    p(211, "Jordi Alba", 91, "LB", ["LWB", "LM"], "Spain", ["Valencia", "Barcelona", "Inter Miami"], ["2012"], ["spain10", "tiki"], "A"),
    p(212, "Ferland Mendy", 86, "LB", ["LWB", "CB"], "France", ["Lyon", "Real Madrid"], ["2022"], ["galactico", "france"], "C"),
    p(213, "Antonio Rudiger", 90, "CB", ["RB"], "Germany", ["Stuttgart", "Roma", "Chelsea", "Real Madrid"], ["2022"], ["chelsea", "galactico", "germany"], "B"),
    p(214, "Thiago Silva", 92, "CB", [], "Brazil", ["AC Milan", "PSG", "Chelsea"], ["2012", "2021"], ["milan", "chelsea", "brazil"], "A"),
    p(215, "Giorgio Chiellini", 91, "CB", [], "Italy", ["Fiorentina", "Juventus", "LAFC"], ["2021"], ["italy06", "italy"], "B"),
    p(216, "Leonardo Bonucci", 90, "CB", [], "Italy", ["Bari", "Juventus", "AC Milan"], ["2021"], ["italy06", "milan"], "B"),
    p(217, "Matthijs de Ligt", 89, "CB", [], "Netherlands", ["Ajax", "Juventus", "Bayern Munich", "Manchester United"], ["2019"], ["netherlands", "bayern"], "B"),
    p(218, "David Luiz", 88, "CB", ["CDM"], "Brazil", ["Benfica", "Chelsea", "PSG", "Arsenal"], ["2012"], ["chelsea", "brazil"], "B"),
    p(219, "John Stones", 88, "CB", ["CDM", "RB"], "England", ["Everton", "Manchester City"], ["2023"], ["city23", "england"], "B"),
    p(220, "Marquinhos", 90, "CB", ["CDM"], "Brazil", ["Roma", "PSG"], ["2020"], ["psg25", "brazil"], "B"),
    p(221, "Ivan Perisic", 88, "LM", ["LW", "LWB"], "Croatia", ["Dortmund", "Inter", "Bayern Munich", "Tottenham"], ["2018"], ["inter25", "croatia"], "B"),
    p(222, "Leroy Sane", 89, "RM", ["RW", "LW"], "Germany", ["Schalke", "Manchester City", "Bayern Munich"], ["2020"], ["city23", "bayern", "germany"], "B"),
    p(223, "Kingsley Coman", 88, "LM", ["LW", "RW"], "France", ["PSG", "Juventus", "Bayern Munich"], ["2020"], ["bayern20", "france"], "B"),
    p(224, "Riyad Mahrez", 90, "RW", ["RM", "CAM"], "Algeria", ["Leicester", "Manchester City", "Al-Ahli"], ["2016", "2023"], ["city23"], "B"),
    p(225, "Federico Chiesa", 87, "RW", ["LW", "RM"], "Italy", ["Fiorentina", "Juventus", "Liverpool"], ["2021"], ["italy", "liverpool25"], "B"),
    p(226, "Raheem Sterling", 88, "LW", ["RW", "RM"], "England", ["Liverpool", "Manchester City", "Chelsea", "Arsenal"], ["2019"], ["city23", "chelsea", "england"], "B"),
    p(227, "Luis Diaz", 88, "LW", ["RW", "LM"], "Colombia", ["Porto", "Liverpool"], ["2024"], ["liverpool25"], "B"),
    p(228, "Frenkie de Jong", 90, "CM", ["CDM"], "Netherlands", ["Ajax", "Barcelona"], ["2019"], ["tiki", "netherlands"], "A"),
    p(229, "Ilkay Gundogan", 90, "CM", ["CAM", "CDM"], "Germany", ["Dortmund", "Manchester City", "Barcelona"], ["2023"], ["city23", "germany"], "B"),
    p(230, "Jorginho", 88, "CDM", ["CM"], "Italy", ["Napoli", "Chelsea", "Arsenal"], ["2021"], ["chelsea", "italy"], "B"),
    p(231, "Joshua Kimmich", 91, "CDM", ["RB", "CM"], "Germany", ["Stuttgart", "RB Leipzig", "Bayern Munich"], ["2020"], ["bayern20", "germany14"], "A"),
    p(232, "Leon Goretzka", 88, "CM", ["CDM"], "Germany", ["Schalke", "Bayern Munich"], ["2020"], ["bayern20", "germany"], "B"),
    p(233, "Paul Pogba", 91, "CM", ["CAM", "CDM"], "France", ["Manchester United", "Juventus"], ["2018"], ["france", "united"], "A"),
    p(234, "Oleksandr Zinchenko", 86, "LB", ["CM", "LWB"], "Ukraine", ["Manchester City", "Arsenal"], ["2023"], ["city23", "arsenal25"], "C"),
    p(235, "Lucas Hernandez", 87, "LB", ["CB", "LWB"], "France", ["Atletico Madrid", "Bayern Munich", "PSG"], ["2018"], ["france", "psg25"], "B"),
    p(236, "Benjamin Pavard", 86, "RB", ["CB", "RWB"], "France", ["Stuttgart", "Bayern Munich", "Inter"], ["2018"], ["france", "inter25"], "C"),
    p(237, "Aaron Wan-Bissaka", 85, "RB", ["RWB"], "England", ["Crystal Palace", "Manchester United", "West Ham"], ["2020"], ["united", "england"], "C"),
    p(238, "Luke Shaw", 86, "LB", ["LWB", "CB"], "England", ["Southampton", "Manchester United"], ["2021"], ["united", "england"], "C"),
    p(239, "Miguel Gutierrez", 84, "LB", ["LWB"], "Spain", ["Real Madrid", "Girona"], ["2024"], ["spain"], "C"),
    p(240, "Malo Gusto", 84, "RB", ["RWB"], "France", ["Lyon", "Chelsea"], ["2024"], ["chelsea", "france"], "C")
  ];

  var managers = [
    m(1, "Pep Guardiola", "Positional play", [ml("club", "Barcelona"), ml("club", "Manchester City")], "Barcelona and Man City alumni raise synergy"),
    m(2, "Carlo Ancelotti", "Flexible stars", [ml("club", "Real Madrid"), ml("club", "AC Milan")], "Real Madrid and AC Milan alumni raise synergy"),
    m(3, "Jose Mourinho", "Compact counter", [ml("club", "Chelsea"), ml("club", "Inter")], "Chelsea and Inter alumni raise synergy"),
    m(4, "Johan Cruyff", "Total football", [ml("nation", "Netherlands"), ml("club", "Barcelona")], "Dutch internationals and Barcelona alumni raise synergy"),
    m(5, "Zinedine Zidane", "Big-game calm", [ml("nation", "France"), ml("club", "Real Madrid")], "French internationals and Real Madrid alumni raise synergy"),
    m(6, "Vicente del Bosque", "Control block", [ml("nation", "Spain"), ml("club", "Real Madrid")], "Spanish internationals and Real Madrid alumni raise synergy"),
    m(7, "Jurgen Klopp", "Heavy press", [ml("club", "Liverpool"), ml("nation", "Germany")], "Liverpool alumni and German internationals raise synergy"),
    m(8, "Arsene Wenger", "Creative flow", [ml("club", "Arsenal"), ml("nation", "France")], "Arsenal alumni and French internationals raise synergy"),
    m(9, "Arrigo Sacchi", "Milan press", [ml("club", "AC Milan"), ml("nation", "Italy")], "AC Milan alumni and Italian internationals raise synergy"),
    m(10, "Luiz Felipe Scolari", "Tournament Brazil", [ml("nation", "Brazil"), ml("nation", "Portugal")], "Brazilian and Portuguese internationals raise synergy"),
    m(11, "Didier Deschamps", "Tournament pragmatism", [ml("nation", "France"), ml("nation", "Italy")], "French and Italian internationals raise synergy"),
    m(12, "Alex Ferguson", "Relentless width", [ml("club", "Manchester United"), ml("nation", "England")], "Man United alumni and English internationals raise synergy")
  ];

  var formations = [
    f("4-3-3", ["GK", "LB", "CB", "CB", "RB", "CM", "CDM", "CM", "LW", "ST", "RW"], [[50, 92], [16, 73], [38, 75], [62, 75], [84, 73], [28, 50], [50, 56], [72, 50], [22, 24], [50, 16], [78, 24]]),
    f("4-2-3-1", ["GK", "LB", "CB", "CB", "RB", "CDM", "CDM", "LM", "CAM", "RM", "ST"], [[50, 92], [16, 73], [38, 75], [62, 75], [84, 73], [38, 56], [62, 56], [21, 38], [50, 35], [79, 38], [50, 17]]),
    f("4-4-2", ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"], [[50, 92], [16, 73], [38, 75], [62, 75], [84, 73], [18, 49], [40, 52], [60, 52], [82, 49], [40, 18], [60, 18]]),
    f("4-1-2-1-2", ["GK", "LB", "CB", "CB", "RB", "CDM", "CM", "CM", "CAM", "ST", "ST"], [[50, 92], [16, 73], [38, 75], [62, 75], [84, 73], [50, 59], [34, 47], [66, 47], [50, 33], [39, 18], [61, 18]]),
    f("4-5-1", ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CDM", "CM", "RM", "ST"], [[50, 92], [16, 73], [38, 75], [62, 75], [84, 73], [16, 46], [36, 49], [50, 57], [64, 49], [84, 46], [50, 17]]),
    f("3-5-2", ["GK", "CB", "CB", "CB", "LM", "CM", "CDM", "CM", "RM", "ST", "ST"], [[50, 92], [28, 75], [50, 78], [72, 75], [16, 51], [36, 49], [50, 58], [64, 49], [84, 51], [39, 18], [61, 18]]),
    f("3-4-3", ["GK", "CB", "CB", "CB", "LM", "CM", "CM", "RM", "LW", "ST", "RW"], [[50, 92], [28, 75], [50, 78], [72, 75], [17, 52], [42, 52], [58, 52], [83, 52], [22, 24], [50, 16], [78, 24]]),
    f("3-4-2-1", ["GK", "CB", "CB", "CB", "LM", "CM", "CM", "RM", "CAM", "CAM", "ST"], [[50, 92], [28, 75], [50, 78], [72, 75], [17, 52], [42, 53], [58, 53], [83, 52], [38, 31], [62, 31], [50, 16]]),
    f("5-3-2", ["GK", "LWB", "CB", "CB", "CB", "RWB", "CM", "CDM", "CM", "ST", "ST"], [[50, 92], [13, 70], [31, 76], [50, 78], [69, 76], [87, 70], [35, 50], [50, 57], [65, 50], [39, 18], [61, 18]]),
    f("5-4-1", ["GK", "LWB", "CB", "CB", "CB", "RWB", "LM", "CM", "CM", "RM", "ST"], [[50, 92], [13, 70], [31, 76], [50, 78], [69, 76], [87, 70], [19, 48], [42, 52], [58, 52], [81, 48], [50, 16]]),
    f("4-3-2-1", ["GK", "LB", "CB", "CB", "RB", "CM", "CDM", "CM", "CAM", "CAM", "ST"], [[50, 92], [16, 73], [38, 75], [62, 75], [84, 73], [31, 52], [50, 58], [69, 52], [39, 31], [61, 31], [50, 16]]),
    f("4-2-2-2", ["GK", "LB", "CB", "CB", "RB", "CDM", "CDM", "CAM", "CAM", "ST", "ST"], [[50, 92], [16, 73], [38, 75], [62, 75], [84, 73], [38, 56], [62, 56], [35, 35], [65, 35], [39, 18], [61, 18]])
  ];

  var curatedPacks = [
    pack("Barcelona 2009-2011", "tiki", [1, 9, 10, 11, 12, 13, 14, 15, 37]),
    pack("Spain 2010", "spain10", [9, 10, 11, 13, 14, 15, 16, 17, 50]),
    pack("Real Madrid 2016-2018", "galactico", [2, 16, 17, 18, 19, 20, 21, 22, 23, 50, 80]),
    pack("Brazil 2002", "brazil02", [3, 24, 25, 26, 27, 29]),
    pack("AC Milan 2005-2007", "milan", [25, 28, 29, 30, 31, 32, 33, 34]),
    pack("Arsenal Invincibles", "arsenal", [37, 38, 39, 40, 41, 42, 76]),
    pack("Manchester United 2008", "united08", [2, 44, 45, 46, 47, 49]),
    pack("Germany 2014", "germany14", [19, 51, 52, 53, 54, 55, 56]),
    pack("Manchester City 2023", "city23", [57, 58, 59, 60, 61, 62, 85]),
    pack("Liverpool 2019", "press", [67, 68, 69, 70, 71, 72]),
    pack("France Tournament Core", "france", [4, 20, 37, 39, 77, 78, 79, 80, 81]),
    pack("Argentina 2022", "argentina22", [1, 82, 83, 84, 85]),
    pack("Inter 2010", "inter10", [99, 100, 101, 102, 103, 104, 105]),
    pack("Bayern 2013", "bayern13", [51, 52, 53, 95, 106, 107, 109, 110]),
    pack("Bayern 2020", "bayern20", [51, 108, 109, 110, 111, 112, 113]),
    pack("France 1998", "france98", [4, 39, 122, 123, 124, 125]),
    pack("Manchester United 1999", "united", [43, 47, 48, 126, 127, 128, 129, 130, 154]),
    pack("Brazil 1994", "brazil94", [25, 138, 139, 140, 141]),
    pack("Barcelona Dream Team", "dream-team", [63, 138, 142, 143, 144]),
    pack("Portugal Icons", "portugal", [2, 145, 146, 147, 148, 149, 150]),
    pack("Classic Icons", "classic", [5, 6, 91, 92, 93, 94, 151, 152, 153, 154, 155, 156]),
    pack("PSG 2025", "psg25", [159, 161, 163, 164, 165, 167, 168, 197, 198]),
    pack("Barcelona 2025", "barca25", [160, 162, 169, 11, 12, 13]),
    pack("Arsenal 2025", "arsenal25", [37, 42, 119, 175, 176, 177, 178, 179]),
    pack("Real Madrid 2025", "madrid25", [16, 17, 18, 86, 87, 180, 181, 182, 183, 184, 185, 199]),
    pack("Inter 2025", "inter25", [99, 100, 103, 104, 105, 171, 188, 189, 190, 191]),
    pack("Chelsea 2025", "chelsea25", [73, 74, 75, 76, 118, 170, 200]),
    pack("Liverpool 2025", "liverpool25", [67, 68, 69, 70, 71, 72, 134, 135, 136, 137, 172, 173, 206, 225, 227]),
    pack("Fullback Rotation", "balanced-flanks", [12, 22, 24, 25, 42, 52, 99, 104, 123, 134, 135, 163, 164, 184, 190, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 234, 235, 236, 237, 238, 239, 240]),
    pack("Modern Wide Lanes", "modern-wide", [60, 107, 126, 153, 162, 175, 180, 188, 190, 203, 205, 206, 207, 221, 222, 223, 224, 225, 226, 227]),
    pack("Modern Defensive Core", "modern-defense", [61, 67, 80, 178, 179, 184, 189, 190, 213, 214, 215, 216, 217, 218, 219, 220]),
    pack("Modern Midfield Balance", "modern-midfield", [57, 59, 87, 161, 169, 172, 173, 176, 177, 180, 181, 188, 191, 195, 197, 198, 228, 229, 230, 231, 232, 233])
  ];

  var comboRules = [
    combo("Tiki-taka", "tactic", 5, ["tiki"], 5, [1, 9, 10, 11]),
    combo("MSN Front Three", "front", 4, ["msn"], 3, [1, 7, 8]),
    combo("Galactico Core", "tactic", 5, ["galactico"], 5, [2, 17, 18, 20]),
    combo("Brazil 2002 Magic", "tactic", 5, ["brazil02"], 5, [3, 24, 25, 26, 27]),
    combo("Milan Wall", "defense", 4, ["milan-wall"], 3, [30, 31]),
    combo("Arsenal Invincibles", "tactic", 4, ["arsenal"], 4, [37, 38, 39]),
    combo("Heavy Metal Press", "tactic", 4, ["press"], 4, [67, 68, 69, 70]),
    combo("Total Football", "tactic", 5, ["total-football"], 5, [63, 64, 65, 66]),
    combo("City Control", "tactic", 4, ["city23"], 4, [57, 58, 59, 60]),
    combo("France Spine", "tactic", 4, ["france"], 3, [77, 79, 80, 81]),
    combo("Inter Treble", "tactic", 5, ["inter10"], 5, [99, 100, 101, 102]),
    combo("Robbery Bayern", "front", 4, ["bayern13"], 4, [106, 107]),
    combo("France 98 Wall", "defense", 4, ["france98"], 4, [122, 123, 124]),
    combo("United Treble", "tactic", 5, ["united"], 5, [126, 127, 128]),
    combo("Brazil 94 Strike Pair", "front", 3, ["brazil94"], 3, [138, 139]),
    combo("Portugal Golden Thread", "tactic", 4, ["portugal"], 4, [145, 146, 150]),
    combo("PSG 2025 Press", "tactic", 5, ["psg25"], 5, [159, 161, 163, 164]),
    combo("Barcelona New Wave", "front", 4, ["barca25"], 4, [160, 162, 169]),
    combo("Arsenal Control", "tactic", 4, ["arsenal25"], 4, [175, 176, 177, 178]),
    combo("Madrid Next Core", "tactic", 4, ["madrid25"], 4, [87, 180, 181, 182]),
    combo("Inter Modern Spine", "tactic", 4, ["inter25"], 4, [171, 188, 189, 190]),
    combo("Liverpool 2025 Refresh", "tactic", 4, ["liverpool25"], 4, [172, 173]),
    combo("Fullback Engine", "defense", 3, ["balanced-flanks"], 3, [203, 209]),
    combo("Modern Wide Lanes", "tactic", 3, ["modern-wide"], 3, [221, 222]),
    combo("Defensive Control", "defense", 4, ["modern-defense"], 4, [214, 220]),
    combo("Midfield Balance", "tactic", 4, ["modern-midfield"], 4, [228, 231])
  ];

  var app = document.getElementById("app");

  var state = loadState() || newDraftState();
  var selectedSource = null;
  var draggedSource = null;
  var inspectTeam = null;
  var tournamentTimer = null;
  var playerImageIndexPromise = null;
  var peer = null;
  var peerConn = null;

  maybeJoinVersusFromUrl();
  render();

  function p(id, name, rating, primary, secondary, nation, clubs, eras, tags, tier) {
    return { id: id, name: name, rating: rebalanceRating(rating, tier), primary: primary, secondary: secondary, nation: nation, clubs: clubs, eras: eras, tags: tags, tier: tier };
  }

  function rebalanceRating(rawRating, tier) {
    var base;
    if (rawRating >= 100) base = 100;
    else if (rawRating >= 99) base = 96;
    else if (rawRating >= 98) base = 94;
    else if (rawRating >= 97) base = 92;
    else if (rawRating >= 96) base = 89;
    else if (rawRating >= 95) base = 87;
    else if (rawRating >= 94) base = 85;
    else if (rawRating >= 93) base = 83;
    else if (rawRating >= 92) base = 81;
    else if (rawRating >= 91) base = 79;
    else if (rawRating >= 90) base = 77;
    else if (rawRating >= 89) base = 75;
    else if (rawRating >= 88) base = 73;
    else if (rawRating >= 87) base = 71;
    else if (rawRating >= 86) base = 69;
    else if (rawRating >= 85) base = 67;
    else if (rawRating >= 84) base = 65;
    else base = 63;

    var modifier = tier === "S" ? 0 : tier === "A" ? -1 : tier === "B" ? -3 : tier === "C" ? -5 : -2;
    var cap = tier === "S" ? 100 : tier === "A" ? 86 : tier === "B" ? 78 : tier === "C" ? 68 : 82;
    var floor = tier === "S" ? 84 : tier === "A" ? 76 : tier === "B" ? 66 : tier === "C" ? 58 : 64;
    return Math.max(floor, Math.min(cap, base + modifier));
  }

  function ml(kind, name) {
    return { kind: kind, name: name };
  }

  function m(id, name, style, links, bonusText) {
    return { id: id, name: name, style: style, links: links, bonusText: bonusText, image: managerAsset(id) };
  }

  function playerMatchesManagerLink(player, link) {
    if (!player || !link) return false;
    if (link.kind === "nation") return player.nation === link.name;
    return player.clubs.indexOf(link.name) !== -1;
  }

  function formatManagerLink(link) {
    if (!link) return "";
    if (link.kind === "nation") return link.name;
    return link.name;
  }

  function formatManagerLinkLabel(link) {
    if (!link) return "";
    if (link.kind === "nation") return link.name + " (nation)";
    return link.name + " (club)";
  }

  function f(name, slots, coords) {
    return { name: name, slots: slots.map(function (pos, index) { return { id: "s" + index, pos: pos, x: coords[index][0], y: coords[index][1] }; }) };
  }

  function pack(name, tag, ids) {
    return { name: name, tag: tag, ids: ids };
  }

  function combo(name, type, points, tags, minCount, requiredIds) {
    return { name: name, type: type, points: points, tags: tags, minCount: minCount, requiredIds: requiredIds };
  }

  function buildIdRange(maxId) {
    var ids = [];
    for (var id = 1; id <= maxId; id += 1) ids.push(id);
    return ids;
  }

  function newDraftState() {
    var draft = {
      mode: "draft",
      activeTab: "solo",
      draftId: Date.now(),
      draftPhase: "manager",
      formation: cloneFormation(formations[0]),
      formationLocked: false,
      manager: null,
      slots: makeSlots(formations[0]),
      pickedIds: [],
      burnedIds: [],
      viewedStacks: [],
      currentRoll: null,
      freeRerolls: FREE_REROLLS,
      paidRerollsAvailable: 0,
      paidRerollsUsed: 0,
      savedTeams: [],
      bots: generateBotPool(),
      matchLog: [],
      tournament: null,
      versus: defaultVersusState(),
      autoPlace: true,
      bench: makeBench(),
      teamName: "XI " + randomWord()
    };
    draft.currentRoll = createRoll(draft);
    return draft;
  }

  function makeBench() {
    var bench = [];
    for (var i = 0; i < 11; i += 1) {
      bench.push({ id: "b" + i, playerId: null });
    }
    return bench;
  }

  function defaultVersusState() {
    return {
      role: null,
      roomId: null,
      connected: false,
      phase: "lobby",
      opponentName: "",
      opponentProgress: 0,
      opponentReady: false,
      myReady: false,
      opponentTeam: null,
      series: null,
      cupResult: null,
      error: ""
    };
  }

  function makeSlots(formation) {
    return formation.slots.map(function (slot) {
      return { slotId: slot.id, pos: slot.pos, x: slot.x, y: slot.y, playerId: null };
    });
  }

  function cloneFormation(formation) {
    return { name: formation.name, slots: formation.slots.map(function (slot) { return Object.assign({}, slot); }) };
  }

  function randomWord() {
    var words = ["Foundry", "Dynasty", "Atlas", "Crown", "Forge", "Signal", "Union", "Vista"];
    return words[Math.floor(Math.random() * words.length)];
  }

  function playerById(id) {
    return players.find(function (player) { return player.id === id; }) || null;
  }

  function managerById(id) {
    return managers.find(function (manager) { return manager.id === id; }) || null;
  }

  function formationByName(name) {
    return formations.find(function (formation) { return formation.name === name; }) || formations[0];
  }

  function createRoll(draft) {
    var phase = draft.draftPhase || draftPhaseFromState(draft);
    if (phase === "manager") {
      return {
        id: "roll-" + Date.now() + "-" + Math.random().toString(16).slice(2),
        packName: "Choose Manager",
        packType: "Step 1",
        playerIds: [],
        managers: sample(managers, 3).map(function (manager) { return manager.id; }),
        formations: []
      };
    }
    if (phase === "formation") {
      return {
        id: "roll-" + Date.now() + "-" + Math.random().toString(16).slice(2),
        packName: "Choose Formation",
        packType: "Step 2",
        playerIds: [],
        managers: [],
        formations: sample(formations, 3).map(function (formation) { return formation.name; })
      };
    }
    var packRoll = Math.random() < 0.45 ? createCuratedStack(draft) : createRandomStack(draft);
    if (packRoll.players.length < 5) {
      packRoll = createRandomStack(draft, true);
    }
    return {
      id: "roll-" + Date.now() + "-" + Math.random().toString(16).slice(2),
      packName: packRoll.name,
      packType: packRoll.type,
      playerIds: packRoll.players.map(function (player) { return player.id; }),
      managers: [],
      formations: []
    };
  }

  function draftPhaseFromState(draft) {
    if (!draft.manager) return "manager";
    if (!draft.formationLocked) return "formation";
    return "players";
  }

  function createCuratedStack(draft) {
    var available = availableIds(draft);
    var packs = sample(curatedPacks, curatedPacks.length);
    for (var i = 0; i < packs.length; i += 1) {
      var packDef = packs[i];
      var candidates = packDef.ids.map(playerById).filter(Boolean).filter(function (player) {
        return available.indexOf(player.id) !== -1;
      });
      if (candidates.length >= 5) {
        return { name: packDef.name, type: "Curated", players: sample(candidates, 5) };
      }
    }
    return createRandomStack(draft, true);
  }

  function createRandomStack(draft, allowReuseBurned) {
    var available = availableIds(draft, allowReuseBurned).map(playerById).filter(Boolean);
    var stack = [];

    positionTargetsForDraft(draft, available).slice(0, 2).forEach(function (target) {
      if (stack.length >= 3) return;
      var candidates = target.candidates.filter(function (player) {
        return !stack.some(function (picked) { return picked.id === player.id; });
      });
      if (candidates.length) {
        stack.push(weightedSample(candidates, 1, function (player) {
          return slotTargetWeight(player, target.pos);
        })[0]);
      }
    });

    weightedSample(available.filter(function (player) { return !stack.some(function (picked) { return picked.id === player.id; }); }), 5 - stack.length, randomPackWeight).forEach(function (player) {
      stack.push(player);
    });
    return { name: "Mixed Legends", type: "Random", players: stack };
  }

  function positionTargetsForDraft(draft, available) {
    var openSlots = draft.slots.filter(function (slot) { return !slot.playerId; });
    var seen = {};
    return openSlots.map(function (slot) {
      var candidates = available.filter(function (player) { return canCoverSlot(player, slot.pos); });
      return {
        pos: slot.pos,
        candidates: candidates,
        scarcity: candidates.length ? 1 / candidates.length : 99
      };
    }).filter(function (target) {
      if (seen[target.pos] || !target.candidates.length) return false;
      seen[target.pos] = true;
      return true;
    }).sort(function (a, b) {
      return b.scarcity - a.scarcity;
    });
  }

  function canCoverSlot(player, slotPos) {
    return player.primary === slotPos || player.secondary.indexOf(slotPos) !== -1;
  }

  function slotTargetWeight(player, slotPos) {
    var weight = randomPackWeight(player);
    if (player.primary === slotPos) return weight * 3.8;
    if (player.secondary.indexOf(slotPos) !== -1) return weight * 2.4;
    return weight;
  }

  function randomPackWeight(player) {
    if (player.tier === "S") return 0.18;
    if (player.tier === "A") return 0.78;
    if (player.tier === "B") return 1.85;
    if (player.tier === "C") return 2.6;
    return 1;
  }

  function availableIds(draft, allowReuseBurned) {
    var blocked = new Set(draft.pickedIds.concat(allowReuseBurned ? [] : draft.burnedIds));
    return players.filter(function (player) { return !blocked.has(player.id); }).map(function (player) { return player.id; });
  }

  function sample(items, count) {
    return seededSample(items, count, Math.random);
  }

  function seededSample(items, count, rng) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(rng() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy.slice(0, Math.max(0, count));
  }

  function weightedSample(items, count, weightFn) {
    var pool = items.slice();
    var picks = [];
    while (pool.length && picks.length < count) {
      var total = pool.reduce(function (sum, item) { return sum + Math.max(0.001, weightFn(item)); }, 0);
      var roll = Math.random() * total;
      var cursor = 0;
      var pickedIndex = 0;
      for (var i = 0; i < pool.length; i += 1) {
        cursor += Math.max(0.001, weightFn(pool[i]));
        if (roll <= cursor) {
          pickedIndex = i;
          break;
        }
      }
      picks.push(pool[pickedIndex]);
      pool.splice(pickedIndex, 1);
    }
    return picks;
  }

  function captureScrollState() {
    var tournamentBody = document.querySelector(".tournament-panel-body");
    return {
      windowY: window.scrollY,
      tournamentBody: tournamentBody ? tournamentBody.scrollTop : 0
    };
  }

  function restoreScrollState(scrollState) {
    if (!scrollState) return;
    requestAnimationFrame(function () {
      window.scrollTo(0, scrollState.windowY);
      var tournamentBody = document.querySelector(".tournament-panel-body");
      if (tournamentBody) tournamentBody.scrollTop = scrollState.tournamentBody;
    });
  }

  function normalizeActiveTab() {
    if (!ENABLE_SAVED_TEAMS && state.activeTab === "saved") state.activeTab = "solo";
    if (!ENABLE_LEAGUE && (state.activeTab === "leaderboard" || state.activeTab === "cup" || state.activeTab === "online")) {
      state.activeTab = "solo";
    }
  }

  function render() {
    normalizeActiveTab();
    if (!state.versus) state.versus = defaultVersusState();
    var preserveScroll = Boolean(state.tournament);
    var scrollState = preserveScroll ? captureScrollState() : null;
    var rating = calculateRating(state);
    var teamFull = isTeamFull(state);
    app.innerHTML = [
      renderTopbar(),
      renderGame(rating, teamFull),
      inspectTeam ? renderInspectModal(inspectTeam) : ""
    ].join("");
    bindEvents();
    hydratePlayerImages();
    hydrateManagerImages();
    restoreScrollState(scrollState);
  }

  function visibleModeTabCount() {
    var count = 2;
    if (ENABLE_SAVED_TEAMS) count += 1;
    if (ENABLE_LEAGUE) count += 1;
    return count;
  }

  function renderTopbar() {
    return [
      '<header class="topbar">',
      '<div class="brand">',
      '<div class="brand-row"><span class="brand-mark" aria-hidden="true"><span>XI</span></span><div><h1><span class="brand-xi">XI</span> <span class="brand-cup">Cup</span></h1><div class="subcopy">Draft legend stacks, build chemistry, and run the cup — solo or 1v1 with friends.</div></div></div>',
      '</div>',
      '<nav class="mode-tabs mode-tabs-' + visibleModeTabCount() + '" aria-label="Mode">',
      tabButton("solo", "Solo Draft"),
      tabButton("versus", "1v1"),
      ENABLE_SAVED_TEAMS ? tabButton("saved", "Teams") : "",
      ENABLE_LEAGUE ? tabButton("leaderboard", "League") : "",
      '</nav>',
      '</header>'
    ].join("");
  }

  function tabButton(tab, label) {
    return '<button class="tab-button ' + (state.activeTab === tab ? "active" : "") + '" data-tab="' + tab + '"><span class="tab-glyph glyph-' + tab + '" aria-hidden="true"></span><span>' + label + '</span></button>';
  }

  function renderGame(rating, teamFull) {
    if (ENABLE_SAVED_TEAMS && state.activeTab === "saved") return renderSavedView(rating);
    if (ENABLE_LEAGUE && state.activeTab === "leaderboard") return renderLeagueView(rating);
    if (state.activeTab === "versus") return renderVersusView(rating, teamFull);
    return [
      '<main class="main-grid">',
      renderFieldPanel(rating),
      state.tournament ? renderTournamentPanel() : renderDraftPanel(teamFull),
      '</main>'
    ].join("");
  }

  function renderFieldPanel(rating) {
    var formationLabel = state.formationLocked ? state.formation.name : "Formation pending";
    var fieldComplete = isFieldComplete(state);
    var managerLabel = state.manager ? managerById(state.manager).name : "No manager";
    return [
      '<section class="panel field-panel">',
      '<div class="panel-header">',
      '<div class="panel-title"><span class="status-dot"></span><div><label class="team-name-field"><span class="sr-only">Team name</span><input class="team-name-input" type="text" maxlength="34" value="' + escapeHtml(state.teamName) + '" data-team-name-input ' + (canEditTeamName() ? "" : "disabled") + '></label><small>' + escapeHtml(formationLabel) + ' · ' + escapeHtml(managerLabel) + '</small></div></div>',
      '<div class="field-rating-pill"><strong>' + rating.total.toFixed(1) + '</strong><span>Rating</span></div>',
      '<div class="actions-row field-controls">',
      '<label class="auto-place-toggle"><input type="checkbox" data-toggle-auto-place ' + (state.autoPlace ? "checked" : "") + '><span>Auto-place</span></label>',
      ENABLE_SAVED_TEAMS ? '<button class="ghost-button" data-action="save-team" ' + (!fieldComplete ? "disabled" : "") + '>Save Team</button>' : "",
      '<button class="danger-button" data-action="new-draft">New Draft</button>',
      '</div>',
      '</div>',
      '<div class="placement-hint">Drag or tap to move players between bench and pitch.</div>',
      '<div class="pitch-wrap">',
      '<div class="pitch">',
      '<div class="center-circle"></div><div class="box top"></div><div class="box bottom"></div>',
      state.slots.map(renderSlot).join(""),
      '</div>',
      '</div>',
      renderBenchRow(),
      renderRatingSheet(rating, fieldComplete),
      '</section>'
    ].join("");
  }

  function renderRatingSheet(rating, fieldComplete) {
    var comboRows = (rating.comboItems || []).map(function (item) {
      return ratingStat(item.label, "+" + item.value.toFixed(1), "Active combo", "gold");
    }).join("");
    return [
      '<div class="rating-sheet">',
      '<div class="rating-sheet-head">',
      '<div><strong>Team Breakdown</strong><span>Chemistry, combos, and lineup fit</span></div>',
      '<div class="rating-sheet-badges">',
      '<span class="lineup-badge ' + (fieldComplete ? "ready" : "") + '">Pitch ' + filledCount(state) + '/11</span>',
      '<span class="lineup-badge ' + (benchFilledCount(state) ? "bench" : "") + '">Bench ' + benchFilledCount(state) + '</span>',
      '</div>',
      '</div>',
      '<div class="rating-sheet-grid">',
      ratingStat("Total", rating.total.toFixed(1), "", "teal"),
      ratingStat("Base XI", rating.base.toFixed(1), "", ""),
      ratingStat("Chemistry", "+" + rating.chemistry.toFixed(1), "Club, nation, lines", "green"),
      ratingStat("Combos", "+" + rating.combos.toFixed(1), "Active links", "gold"),
      ratingStat("Club", "+" + rating.clubChem.toFixed(1), "", "green"),
      ratingStat("Nation", "+" + rating.nationChem.toFixed(1), "", "green"),
      ratingStat("Lines", "+" + rating.lineChem.toFixed(1), "", "green"),
      ratingStat("Manager", rating.managerSynergy ? rating.managerSynergy.toFixed(1) + "/10" : "0/10", rating.managerHitDetail || "Draft connected nations or clubs", "gold"),
      ratingStat("Experience", "+" + rating.experience.toFixed(1), "", ""),
      ratingStat("Pos. loss", rating.positionLoss.toFixed(1), "Off-position penalty", rating.positionLoss > 8 ? "red" : ""),
      '</div>',
      comboRows ? '<div class="rating-sheet-combos">' + comboRows + '</div>' : "",
      '</div>'
    ].join("");
  }

  function ratingStat(label, value, detail, tone) {
    return [
      '<div class="rating-stat ' + (tone || "") + '">',
      '<span class="rating-stat-label">' + escapeHtml(label) + '</span>',
      '<strong class="rating-stat-value">' + escapeHtml(String(value)) + '</strong>',
      detail ? '<span class="rating-stat-detail">' + escapeHtml(detail) + '</span>' : "",
      '</div>'
    ].join("");
  }

  function metric(label, value, tone) {
    return '<div class="metric ' + tone + '"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></div>';
  }

  function renderBenchRow() {
    return [
      '<div class="bench-strip">',
      '<div class="bench-label">Squad Bench</div>',
      '<div class="bench-grid">',
      (state.bench || makeBench()).map(renderBenchSlot).join(""),
      '</div>',
      '</div>'
    ].join("");
  }

  function renderBenchSlot(benchSlot, index) {
    var player = playerById(benchSlot.playerId);
    var selected = isSourceSelected("bench", index);
    var content = player
      ? renderPitchCard(player, { pos: player.primary, label: "Bench" }, "bench")
      : '<div class="bench-empty"><span>' + String(index + 1) + '</span></div>';
    return '<button class="bench-slot ' + (selected ? "selected" : "") + ' ' + (player ? "filled-slot" : "empty-bench") + '" data-bench="' + index + '" draggable="' + (player ? "true" : "false") + '" title="Bench slot ' + (index + 1) + '">' + content + '</button>';
  }

  function renderSlot(slot, index) {
    var player = playerById(slot.playerId);
    var selected = isSourceSelected("field", index);
    var content = player
      ? renderPitchCard(player, slot, "field")
      : '<div class="empty-slot"><span class="empty-pos">' + slot.pos + '</span></div>';
    return '<button class="slot ' + (selected ? "selected" : "") + ' ' + (player ? "filled-slot" : "") + '" style="left:' + slot.x + '%;top:' + slot.y + '%" data-slot="' + index + '" draggable="' + (player ? "true" : "false") + '" title="' + slot.pos + '">' + content + '</button>';
  }

  function renderPitchCard(player, slot, surface) {
    var slotPos = slot.pos || player.primary;
    var effective = effectiveRating(player, slotPos);
    var natural = effectiveRating(player, player.primary);
    var fitDelta = effective - natural;
    var fitClass = fitDelta >= -1 ? "fit-good" : fitDelta >= -8 ? "fit-ok" : "fit-bad";
    var tierClass = player.tier === "S" ? "tier-s" : player.tier === "A" ? "tier-a" : "";
    return [
      '<div class="pitch-card ' + tierClass + ' ' + fitClass + ' pitch-card-' + surface + '">',
      '<div class="pitch-card-top">',
      '<span class="pitch-card-pos">' + escapeHtml(slotPos) + '</span>',
      '<span class="pitch-card-rating">' + Math.round(effective) + '</span>',
      '</div>',
      '<div class="pitch-card-photo"><img data-player-image data-image-candidates="' + escapeHtml(JSON.stringify(playerImageCandidates(player))) + '" alt=""></div>',
      '<div class="pitch-card-name">' + escapeHtml(shortPlayerName(player.name)) + '</div>',
      '<div class="pitch-card-foot"><span>' + escapeHtml(player.primary) + '</span><span class="pitch-card-fit">' + formatFitDelta(fitDelta) + '</span></div>',
      '</div>'
    ].join("");
  }

  function shortPlayerName(name) {
    var parts = String(name).trim().split(/\s+/);
    if (parts.length <= 1) return name;
    return parts[parts.length - 1];
  }

  function formatFitDelta(delta) {
    if (delta >= 0.5) return "+" + Math.round(delta);
    if (delta <= -0.5) return String(Math.round(delta));
    return "=";
  }

  function isSourceSelected(kind, index) {
    return selectedSource && selectedSource.kind === kind && selectedSource.index === index;
  }

  function renderDraftPanel(teamFull) {
    var roll = state.currentRoll;
    var phase = state.draftPhase || draftPhaseFromState(state);
    if (teamFull) {
      var lineupReady = isFieldComplete(state);
      return [
        '<aside class="panel draft-panel">',
        '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>Draft Complete</h2><small>' + (lineupReady ? "Lineup locked on the pitch." : "Place every player on the pitch to continue.") + '</small></div></div></div>',
        '<div class="draft-body">',
        lineupReady
          ? '<div class="notice">This team is ready for a 16-team cup with four groups, knockout rounds, and 15 randomly drafted AI teams.</div>'
          : '<div class="notice">All 11 picks are in. Move bench players onto the pitch before saving, simulating, or entering a cup.</div>',
        '<div class="actions-row"><button class="primary-button" data-action="simulate-tournament" ' + (!lineupReady ? "disabled" : "") + '>Simulate Tournament</button></div>',
        '</div>',
        '</aside>'
      ].join("");
    }

    var managerChoices = roll.managers || [];
    var formationChoices = roll.formations || [];
    var progressText = phase === "manager" ? "Step 1 of 3" : phase === "formation" ? "Step 2 of 3" : "Player " + (pickedCount(state) + 1) + " of 11";
    return [
      '<aside class="panel draft-panel">',
      '<div class="panel-header">',
      '<div class="panel-title"><span class="status-dot"></span><div><h2>' + draftPanelTitle(phase) + '</h2><small>' + progressText + ' | ' + roll.packName + ' | ' + roll.packType + '</small></div></div>',
      '<button class="primary-button reroll-button" data-action="smart-reroll" ' + (canReroll() ? "" : "disabled") + '><span class="button-glyph" aria-hidden="true"></span>' + rerollLabel() + '</button>',
      '</div>',
      '<div class="draft-body">',
      renderDraftPhaseBody(phase, roll, managerChoices, formationChoices),
      '</div>',
      '</aside>'
    ].join("");
  }

  function draftPanelTitle(phase) {
    if (phase === "manager") return "Pick Manager";
    if (phase === "formation") return "Pick Formation";
    return "Current Roll";
  }

  function renderDraftPhaseBody(phase, roll, managerChoices, formationChoices) {
    if (phase === "manager") {
      return [
        '<div class="draft-instruction">Pick a manager, then draft players from their connected nations or clubs. Synergy is purely connection-based — up to 3 pitch players count per link, scored out of 10.</div>',
        '<div class="section-label">Manager cards</div>',
        '<div class="choice-grid manager-grid">',
        managerChoices.map(function (id) { return renderManagerChoice(managerById(id)); }).join(""),
        '</div>'
      ].join("");
    }
    if (phase === "formation") {
      return [
        '<div class="draft-instruction">Choose the shape your XI will be built around. You can reroll for three different formations before player drafting begins.</div>',
        '<div class="section-label">Formation cards</div>',
        '<div class="choice-grid formation-grid">',
        formationChoices.map(function (name) { return renderFormationChoice(name); }).join(""),
        '</div>'
      ].join("");
    }
    return [
      '<div class="draft-instruction">Pick one player from this stack. Skipped cards leave this draft.</div>',
      '<div class="section-label">Player stack</div>',
      '<div class="player-grid">',
      roll.playerIds.map(function (id) { return renderPlayerCard(playerById(id), roll.packName); }).join(""),
      '</div>'
    ].join("");
  }

  function renderPlayerCard(player, packName) {
    if (!player) return "";
    var secondaryTags = player.secondary.length ? '<div class="tag-row secondary-tags">' + player.secondary.map(function (pos) { return '<span class="tag">' + pos + '</span>'; }).join("") + '</div>' : "";
    return [
      '<button class="player-card ' + (player.tier === "S" ? "signature" : "") + '" data-pick-player="' + player.id + '">',
      '<div class="card-art"><img data-player-image data-image-candidates="' + escapeHtml(JSON.stringify(playerImageCandidates(player, packName))) + '" alt=""></div>',
      '<div class="card-top"><div><div class="card-position">' + player.primary + '</div><div class="card-name">' + escapeHtml(player.name) + '</div></div><div class="card-rating">' + player.rating + '</div></div>',
      '<div class="card-bottom">',
      '<div class="tag-row">',
      '<span class="tag">' + escapeHtml(player.nation) + '</span>',
      '<span class="tag">' + escapeHtml(player.clubs[0]) + '</span>',
      '<span class="tag">' + (player.tier === "S" ? "Signature" : "Tier " + player.tier) + '</span>',
      '</div>',
      secondaryTags,
      '<div class="card-foot">' + escapeHtml(player.eras[0] || "Era") + '</div>',
      '</div>',
      '</button>'
    ].join("");
  }

  function renderManagerChoice(manager) {
    return '<button class="choice-card manager-choice" data-pick-manager="' + manager.id + '"><span class="manager-photo"><img data-manager-image data-image-candidates="' + escapeHtml(JSON.stringify(managerImageCandidates(manager))) + '" alt=""></span><span class="choice-copy"><strong>' + escapeHtml(manager.name) + '</strong><span>' + escapeHtml(manager.style) + '</span><span>' + escapeHtml(manager.bonusText) + '</span><span class="manager-link-list">Connections: ' + manager.links.map(formatManagerLinkLabel).join(" · ") + '</span></span></button>';
  }

  function renderFormationChoice(name) {
    var formation = formationByName(name);
    var shape = formation.slots.reduce(function (acc, slot) {
      if (slot.pos !== "GK") acc[slot.pos] = (acc[slot.pos] || 0) + 1;
      return acc;
    }, {});
    var summary = Object.keys(shape).map(function (pos) { return shape[pos] + " " + pos; }).join(" | ");
    return '<button class="choice-card formation-choice" data-pick-formation="' + escapeHtml(name) + '"><span class="formation-dot-map" aria-hidden="true">' + renderFormationDots(formation) + '</span><span class="choice-copy"><strong>' + escapeHtml(name) + '</strong><span>' + escapeHtml(summary) + '</span></span></button>';
  }

  function renderFormationDots(formation) {
    return formation.slots.map(function (slot) {
      return '<i style="left:' + slot.x + '%;top:' + slot.y + '%"></i>';
    }).join("");
  }

  function playerImageCandidates(player, packName) {
    var candidates = [];
    var exact = player.name.replace(/[\\/:*?"<>|]/g, "").trim();
    var slug = slugify(player.name);
    var idStem = "player-" + String(player.id).padStart(3, "0");
    ["png", "webp", "jpg", "jpeg"].forEach(function (ext) {
      if (verifiedPlayerImageIdSet[player.id]) candidates.push(PLAYER_IMAGE_DIR + idStem + "." + ext);
      candidates.push(PLAYER_IMAGE_DIR + exact + "." + ext);
      candidates.push(PLAYER_IMAGE_DIR + slug + "." + ext);
    });
    if (packName) {
      var packExact = packName.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      ["png", "webp", "jpg", "jpeg"].forEach(function (ext) {
        candidates.push(PLAYER_IMAGE_DIR + packExact + " curated pack." + ext);
        candidates.push(PLAYER_IMAGE_DIR + slugify(packName) + "." + ext);
      });
    }
    return candidates;
  }

  function managerImageCandidates(manager) {
    var candidates = [];
    var exact = manager.name.replace(/[\\/:*?"<>|]/g, "").trim();
    var slug = slugify(manager.name);
    var idStem = "manager-" + String(manager.id).padStart(3, "0");
    ["png", "webp", "jpg", "jpeg"].forEach(function (ext) {
      candidates.push(MANAGER_IMAGE_DIR + idStem + "." + ext);
      candidates.push(MANAGER_IMAGE_DIR + exact + "." + ext);
      candidates.push(MANAGER_IMAGE_DIR + slug + "." + ext);
    });
    return candidates;
  }

  function managerAsset(id) {
    return MANAGER_IMAGE_DIR + "manager-" + String(id).padStart(3, "0") + ".png";
  }

  function playerAsset(id) {
    return PLAYER_IMAGE_DIR + "player-" + String(id).padStart(3, "0") + ".png";
  }

  function buildIdRange(maxId) {
    var ids = [];
    for (var id = 1; id <= maxId; id++) ids.push(id);
    return ids;
  }

  function slugify(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function hydratePlayerImages() {
    hydrateCandidateImages("[data-player-image]");
  }

  function hydrateManagerImages() {
    hydrateCandidateImages("[data-manager-image]");
  }

  function hydrateCandidateImages(selector) {
    app.querySelectorAll(selector).forEach(function (image) {
      var candidates = [];
      try {
        candidates = JSON.parse(image.getAttribute("data-image-candidates") || "[]");
      } catch (error) {
        candidates = [];
      }
      loadCandidateImage(image, candidates, 0);
    });
  }

  function loadCandidateImage(image, candidates, index) {
    if (!candidates[index]) return;
    image.onload = function () {
      image.classList.add("loaded");
    };
    image.onerror = function () {
      image.classList.remove("loaded");
      loadCandidateImage(image, candidates, index + 1);
    };
    image.src = encodeURI(candidates[index]);
  }

  function hydratePlayerImagesLegacyIndex() {
    if (!window.fetch) return;
    loadPlayerImageIndex().then(function (imageIndex) {
      app.querySelectorAll("[data-player-image]").forEach(function (image) {
        var candidates = [];
        try {
          candidates = JSON.parse(image.getAttribute("data-image-candidates") || "[]");
        } catch (error) {
          candidates = [];
        }
        var match = candidates.find(function (candidate) { return imageIndex.has(candidate); });
        if (!match) return;
        image.onload = function () {
          image.classList.add("loaded");
        };
        image.onerror = function () {
          image.classList.remove("loaded");
        };
        image.src = encodeURI(match);
      });
    });
  }

  function loadPlayerImageIndex() {
    if (playerImageIndexPromise) return playerImageIndexPromise;
    playerImageIndexPromise = window.fetch(encodeURI(PLAYER_IMAGE_DIR)).then(function (response) {
      if (!response.ok) return new Set();
      return response.text();
    }).then(function (html) {
      if (html instanceof Set) return html;
      var index = new Set();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      doc.querySelectorAll("a[href]").forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href || href.indexOf("?") === 0 || href.indexOf("/") !== -1) return;
        var decoded = decodeURIComponent(href);
        if (/\.(png|jpe?g|webp)$/i.test(decoded)) index.add(PLAYER_IMAGE_DIR + decoded);
      });
      return index;
    }).catch(function () {
      return new Set();
    });
    return playerImageIndexPromise;
  }
  function rerollLabel() {
    return "Reroll (" + availableRerolls() + ")";
  }

  function canReroll() {
    return Boolean(state.currentRoll && !isTeamFull(state) && availableRerolls() > 0);
  }

  function availableRerolls() {
    return (state.freeRerolls || 0) + (state.paidRerollsAvailable || 0);
  }

  function renderSavedTeamsPanel() {
    return [
      '<section class="panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h3>Saved Team</h3><small>One slot in this MVP</small></div></div></div>',
      '<div class="side-body">',
      renderSavedList(),
      '</div>',
      '</section>'
    ].join("");
  }

  function renderSavedView(rating) {
    return [
      '<main class="main-grid">',
      '<section class="panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>Saved Teams</h2><small>Local client storage</small></div></div></div>',
      '<div class="side-body">' + renderSavedList(true) + '</div>',
      '</section>',
      renderMatchPanel(rating),
      '</main>'
    ].join("");
  }

  function renderSavedList(expanded) {
    if (!state.savedTeams.length) return '<div class="empty-state">No saved team yet.</div>';
    return '<div class="saved-list">' + state.savedTeams.map(function (team, index) {
      return [
        '<div class="saved-team">',
        '<div><strong>' + escapeHtml(team.name) + '</strong><span>' + team.formation + ' | ' + team.rating.toFixed(1) + ' | ' + team.record.w + '-' + team.record.l + '</span></div>',
        '<div class="actions-row"><button class="ghost-button" data-inspect-saved="' + index + '">Inspect</button><button class="ghost-button" data-sim-saved="' + index + '">Match</button></div>',
        expanded ? '<div class="small-list saved-wide">' + team.players.map(function (item) { return '<div><span>' + escapeHtml(item.slot) + ' ' + escapeHtml(item.name) + '</span><strong>' + item.effective.toFixed(0) + '</strong></div>'; }).join("") + '</div>' : "",
        '</div>'
      ].join("");
    }).join("") + '</div>';
  }

  function renderMatchPanel(rating) {
    return [
      '<section class="panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h3>Solo Simulation</h3><small>Elo-style match odds</small></div></div><button class="ghost-button" data-action="simulate" ' + (!isFieldComplete(state) && !state.savedTeams.length ? "disabled" : "") + '>Match</button></div>',
      '<div class="side-body">',
      '<div class="notice">Test your XI against drafted AI teams. Results use rating-based odds, so stronger teams are favored but upsets can happen.</div>',
      '<div class="section-label">Recent matches</div>',
      renderMatchLog(),
      '</div>',
      '</section>'
    ].join("");
  }

  function renderTournamentView() {
    var playable = getPlayableTeam();
    var tournament = state.tournament;
    return [
      '<main class="tournament-layout">',
      '<section class="panel tournament-hero">',
      '<div class="panel-header">',
      '<div class="panel-title"><span class="status-dot"></span><div><h2>World Cup Run</h2><small>4 groups, top two advance, then knockout bracket</small></div></div>',
      '<div class="actions-row tournament-actions">',
      '<button class="primary-button" data-action="start-tournament" ' + (!playable ? "disabled" : "") + '>' + (tournament ? "Restart Cup" : "Start Cup") + '</button>',
      '</div>',
      '</div>',
      '<div class="side-body">',
      playable ? '<div class="notice">Entry: ' + escapeHtml(playable.name) + ' | ' + playable.rating.toFixed(1) + '. Group matches can draw; bracket matches always produce a winner.</div>' : '<div class="empty-state">Finish your XI before entering a cup.</div>',
      tournament ? renderTournamentStatus(tournament) : "",
      '</div>',
      '</section>',
      tournament ? renderGroupsPanel(tournament) + renderBracketPanel(tournament) : "",
      '</main>'
    ].join("");
  }

  function renderTournamentPanel() {
    var playable = getPlayableTeam();
    var tournament = state.tournament;
    return [
      '<aside class="panel tournament-panel">',
      '<div class="panel-header">',
      '<div class="panel-title"><span class="status-dot"></span><div><h2>World Cup Run</h2><small>Live group stage and knockout bracket</small></div></div>',
      '<div class="actions-row tournament-actions">',
      '<button class="primary-button" data-action="start-tournament" ' + (!playable ? "disabled" : "") + '>' + (tournament ? "Restart Cup" : "Start Cup") + '</button>',
      '</div>',
      '</div>',
      '<div class="side-body tournament-panel-body">',
      playable ? '<div class="notice">Entry: ' + escapeHtml(playable.name) + ' | ' + playable.rating.toFixed(1) + '. The cup runs automatically after you start or restart.</div>' : '<div class="empty-state">Finish your XI before entering a cup.</div>',
      renderTournamentCupBody(tournament),
      '</div>',
      '</aside>'
    ].join("");
  }

  function renderTournamentCupBody(tournament, options) {
    options = options || {};
    if (!tournament) return "";
    return [
      options.notice ? '<div class="notice">' + options.notice + '</div>' : "",
      renderTournamentStatus(tournament),
      '<div class="tournament-panel-grid">',
      '<section class="tournament-module tournament-module-groups"><div class="module-heading"><strong>Group Stage</strong><span>Top two advance</span></div>' + renderGroupsContent(tournament) + '</section>',
      '<section class="tournament-module tournament-module-bracket"><div class="module-heading"><strong>Knockout Bracket</strong><span>Quarterfinals to final</span></div>' + renderBracketContent(tournament) + '</section>',
      '</div>'
    ].join("");
  }

  function renderTournamentStatus(tournament) {
    var userState = tournamentUserState(tournament);
    return [
      '<div class="tournament-strip">',
      metric("Stage", tournamentStageLabel(tournament), "teal"),
      metric("Played", tournament.played + "/" + tournament.totalMatches, ""),
      metric("Your status", userState.label, userState.tone),
      metric("Champion", tournament.championName || "-", tournament.championName ? "gold" : ""),
      '</div>',
      renderUserProgress(tournament)
    ].join("");
  }

  function renderUserProgress(tournament) {
    var progress = tournamentUserProgress(tournament);
    return [
      '<div class="cup-progress ' + escapeHtml(progress.tone || "") + '">',
      '<div><strong>Your Cup Path</strong><span>' + escapeHtml(progress.summary) + '</span></div>',
      '<div class="path-list">',
      progress.items.map(function (item) {
        return '<div class="path-item ' + escapeHtml(item.status) + '"><strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(item.detail) + '</span></div>';
      }).join(""),
      '</div>',
      '</div>'
    ].join("");
  }

  function renderGroupsPanel(tournament) {
    return [
      '<section class="panel tournament-groups">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h3>Group Stage</h3><small>Three matches per team</small></div></div></div>',
      renderGroupsContent(tournament),
      '</section>'
    ].join("");
  }

  function renderGroupsContent(tournament) {
    return [
      '<div class="group-grid">',
      tournament.groups.map(function (group) {
        var table = groupTable(tournament, group);
        return [
          '<div class="group-block">',
          '<div class="group-title">' + escapeHtml(group.name) + '</div>',
          '<div class="group-table">',
          table.map(function (row, index) {
            var advancing = index < 2;
            var groupsComplete = tournament.stage !== "groups";
            var userEliminated = row.team.user && groupsComplete && !advancing;
            return '<button class="group-row ' + (row.team.user ? "user-team" : "") + ' ' + (row.team.isOpponent ? "opponent-team" : "") + ' ' + (advancing ? "advancing" : "") + ' ' + (userEliminated ? "user-eliminated" : "") + '" data-inspect-tournament-team="' + row.team.tournamentId + '" title="Inspect ' + escapeHtml(row.team.name) + '"><span>' + (index + 1) + '</span><strong>' + escapeHtml(row.team.name) + '</strong><b>' + row.team.rating.toFixed(1) + '</b><em>' + row.pts + '</em><small>' + row.w + "-" + row.d + "-" + row.l + " | " + row.gf + ":" + row.ga + '</small></button>';
          }).join(""),
          '</div>',
          '</div>'
        ].join("");
      }).join(""),
      '</div>'
    ].join("");
  }

  function renderBracketPanel(tournament) {
    return [
      '<section class="panel tournament-bracket">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h3>Knockout Bracket</h3><small>Quarterfinals to final</small></div></div></div>',
      renderBracketContent(tournament),
      '</section>'
    ].join("");
  }

  function renderBracketContent(tournament) {
    return [
      '<div class="bracket-scroll">',
      '<div class="bracket-board">',
      renderBracketRoundColumn(tournament, 0, "Quarterfinals", 4, "qf"),
      renderBracketConnectorColumn("qf-to-sf"),
      renderBracketRoundColumn(tournament, 1, "Semifinals", 2, "sf"),
      renderBracketConnectorColumn("sf-to-final"),
      renderBracketRoundColumn(tournament, 2, "Final", 1, "final"),
      renderBracketConnectorColumn("final-to-champion"),
      renderChampionColumn(tournament),
      '</div>',
      '</div>'
    ].join("");
  }

  function renderBracketRoundColumn(tournament, roundIndex, title, count, className) {
    var round = tournament.bracketRounds[roundIndex] || { name: title, matches: [] };
    var matches = bracketDisplayMatches(round, title, count);
    return [
      '<div class="bracket-stage bracket-stage-' + className + '">',
      '<div class="bracket-stage-title">' + escapeHtml(title) + '</div>',
      '<div class="bracket-stage-body">',
      matches.map(function (match) { return renderBracketMatch(tournament, match); }).join(""),
      '</div>',
      '</div>'
    ].join("");
  }

  function bracketDisplayMatches(round, stage, count) {
    var matches = round.matches.slice();
    while (matches.length < count) matches.push(bracketMatch(stage, null, null));
    return matches.slice(0, count);
  }

  function renderBracketConnectorColumn(type) {
    var pieces = type === "qf-to-sf" ? ["qf-a", "qf-b", "qf-c", "qf-d", "qf-top-v", "qf-top-out", "qf-bottom-v", "qf-bottom-out"] : type === "sf-to-final" ? ["sf-a", "sf-b", "sf-v", "sf-out"] : ["champion-line"];
    return '<div class="connector-column ' + type + '" aria-hidden="true">' + pieces.map(function (piece) {
      return '<span class="connector-piece ' + piece + '"></span>';
    }).join("") + '</div>';
  }

  function renderBracketMatch(tournament, match) {
    var home = tournamentTeam(tournament, match.homeId);
    var away = tournamentTeam(tournament, match.awayId);
    var pending = !home || !away;
    var viewerId = viewerTeamId(tournament);
    var involvesUser = match.homeId === viewerId || match.awayId === viewerId;
    var userLost = involvesUser && match.played && match.winnerId !== viewerId;
    var userWon = involvesUser && match.played && match.winnerId === viewerId;
    var userAdvancing = involvesUser && !userLost;
    return [
      '<div class="bracket-match ' + (match.played ? "played" : "") + ' ' + (userAdvancing ? "user-advancing" : "") + ' ' + (userWon ? "user-win" : "") + ' ' + (userLost ? "user-loss" : "") + '">',
      renderBracketTeamButton(home, match, "home"),
      renderBracketTeamButton(away, match, "away"),
      '<small>' + (pending ? "Waiting for teams" : match.played ? "Final score " + match.score : "Pending") + '</small>',
      '</div>'
    ].join("");
  }

  function renderBracketTeamButton(team, match, side) {
    var id = team ? team.tournamentId : "";
    var score = "";
    if (match.played && match.score) {
      var goals = match.score.split("-");
      score = side === "home" ? goals[0] : goals[1];
    }
    var userLost = team && team.user && match.played && match.winnerId && match.winnerId !== id;
    var userAdvancing = team && team.user && !userLost;
    return [
      '<button class="bracket-team ' + (team && team.user ? "user-team" : "") + ' ' + (team && team.isOpponent ? "opponent-team" : "") + ' ' + (userAdvancing ? "user-advancing" : "") + ' ' + (userLost ? "user-eliminated" : "") + ' ' + (match.played && match.winnerId === id ? "winner" : "") + ' ' + (match.played && id && match.winnerId !== id ? "eliminated" : "") + '" ' + (team ? 'data-inspect-tournament-team="' + id + '" title="Inspect ' + escapeHtml(team.name) + '"' : "disabled") + '>',
      '<span>' + escapeHtml(team ? team.name : "TBD") + '</span>',
      '<em>' + (team ? team.rating.toFixed(1) : "-") + '</em>',
      '<strong>' + escapeHtml(score) + '</strong>',
      '</button>'
    ].join("");
  }

  function renderChampionColumn(tournament) {
    var champion = tournament.championId ? tournamentTeam(tournament, tournament.championId) : null;
    return [
      '<div class="bracket-stage bracket-stage-champion">',
      '<div class="bracket-stage-title">Champion</div>',
      '<div class="bracket-stage-body">',
      '<button class="champion-slot ' + (champion && champion.user ? "user-team user-advancing user-win" : "") + '" ' + (champion ? 'data-inspect-tournament-team="' + champion.tournamentId + '" title="Inspect champion"' : "disabled") + '>',
      '<span>' + escapeHtml(champion ? champion.name : "Awaiting winner") + '</span>',
      '<em>' + (champion ? champion.rating.toFixed(1) : "-") + '</em>',
      '<strong>' + (champion ? "Champion" : "TBD") + '</strong>',
      '</button>',
      '</div>',
      '</div>'
    ].join("");
  }

  function renderTournamentLog(tournament) {
    return [
      '<section class="panel tournament-log">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h3>Live Feed</h3><small>Latest tournament events</small></div></div></div>',
      '<div class="side-body">',
      renderTournamentLogContent(tournament),
      '</div>',
      '</section>'
    ].join("");
  }

  function renderTournamentLogContent(tournament) {
    return tournament.log.length ? '<div class="match-list">' + tournament.log.slice(0, 12).map(function (entry) {
      return '<div class="match-row ' + (entry.user ? "win" : "") + '"><div><strong>' + escapeHtml(entry.title) + '</strong><span>' + escapeHtml(entry.detail) + '</span></div><strong class="leader-score">' + escapeHtml(entry.stage) + '</strong></div>';
    }).join("") + '</div>' : '<div class="empty-state">Start the cup, then step through matches or run it live.</div>';
  }

  function renderMatchLog() {
    if (!state.matchLog.length) return '<div class="empty-state">No matches played.</div>';
    return '<div class="match-list">' + state.matchLog.slice(0, 8).map(function (match) {
      return '<div class="match-row ' + (match.result === "W" ? "win" : "loss") + '"><div><strong>' + escapeHtml(match.home) + ' ' + match.score + ' ' + escapeHtml(match.away) + '</strong><span>' + match.odds + '% win chance | ' + match.result + '</span></div><strong class="leader-score">' + match.rating.toFixed(1) + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderLeagueView() {
    var teams = leaderboardTeams();
    var currentTeam = getCurrentTeamForLeaderboard();
    if (currentTeam && !teams.some(function (team) { return team.id === currentTeam.id; })) {
      teams.push(currentTeam);
      teams.sort(function (a, b) { return b.rating - a.rating || b.record.w - a.record.w; });
    }
    var currentRank = currentTeam ? teams.findIndex(function (team) { return team.id === currentTeam.id; }) + 1 : 0;
    return [
      '<main class="main-grid">',
      '<section class="panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>World Leaderboard</h2><small>Rating-ranked teams across the current ecosystem</small></div></div></div>',
      '<div class="side-body">',
      currentTeam ? '<div class="notice league-rank-card"><strong>Your current rank: #' + currentRank + '</strong><span>' + escapeHtml(currentTeam.name) + ' | ' + currentTeam.rating.toFixed(1) + ' rating</span></div>' : '<div class="empty-state">Finish and save a team to see where you rank.</div>',
      '<div class="leader-list">',
      teams.slice(0, 50).map(function (team, index) {
        return '<button class="leader-row ' + (currentTeam && team.id === currentTeam.id ? "user-team" : "") + '" data-inspect-leader="' + index + '"><span class="leader-rank">#' + (index + 1) + '</span><div><strong>' + escapeHtml(team.name) + '</strong><span>' + escapeHtml(team.owner) + ' | ' + team.formation + ' | ' + team.manager + '</span></div><span class="leader-score">' + team.rating.toFixed(1) + '</span></button>';
      }).join(""),
      '</div></div>',
      '</section>',
      '<section class="panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>Online Competitions</h2><small>League, cups, and event queues</small></div></div><button class="ghost-button" data-action="refresh-bots">Refresh AI Pool</button></div>',
      '<div class="side-body">',
      '<div class="league-event-grid">',
      leagueEvent("World Cup", "Top 50 leaderboard teams", "Runs every 72 hours. Winner is champion for the next cycle and earns +1.0 experience.", "Coming soon"),
      leagueEvent("Hourly Cup", "50-team queue", "Saved teams enter the next available cup. You can leave before the cup starts.", "Coming soon"),
      leagueEvent("Daily Knockout", "Smaller daily bracket", "Fast daily cups for teams outside the World Cup cutoff.", "Coming soon"),
      leagueEvent("Live Match", "1 match per saved team per day", "Rating-based online simulation with experience growth after completed matches.", "Coming soon"),
      '</div>',
      '<div class="notice">AI teams are drafted with the same player pool, pack rules, placement, chemistry, formation, manager, and rating logic as your team.</div>',
      '</div>',
      '</section>',
      '</main>'
    ].join("");
  }

  function leagueEvent(title, meta, detail, status) {
    return '<div class="league-event"><strong>' + escapeHtml(title) + '</strong><em>' + escapeHtml(status) + '</em><span>' + escapeHtml(meta) + '</span><p>' + escapeHtml(detail) + '</p></div>';
  }

  function getCurrentTeamForLeaderboard() {
    if (state.savedTeams && state.savedTeams.length) return state.savedTeams[0];
    if (isFieldComplete(state)) return snapshotTeam(state, "You");
    return null;
  }

  function renderInspectModal(team) {
    return [
      '<div class="modal-backdrop" data-action="close-modal">',
      '<div class="modal" role="dialog" aria-modal="true" aria-label="Team inspection">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>' + escapeHtml(team.name) + '</h2><small>' + escapeHtml(team.owner || "Local") + ' | ' + team.formation + ' | ' + team.rating.toFixed(1) + '</small></div></div><button class="icon-button" data-action="close-modal" title="Close">X</button></div>',
      '<div class="modal-body">',
      '<div class="modal-grid">',
      metric("Rating", team.rating.toFixed(1), "teal"),
      metric("Record", team.record.w + "-" + team.record.l, ""),
      metric("Manager", team.manager || "None", "gold"),
      metric("Experience", "+" + (team.experience || 0).toFixed(1), "green"),
      '</div>',
      '<div class="section-label">Starting XI</div>',
      '<div class="small-list">' + team.players.map(function (item) {
        return '<div><span>' + escapeHtml(item.slot) + ' | ' + escapeHtml(item.name) + '</span><strong>' + item.effective.toFixed(0) + '</strong></div>';
      }).join("") + '</div>',
      '<div class="section-label">Bonuses</div>',
      '<div class="small-list">' + team.bonuses.map(function (item) {
        return '<div><span>' + escapeHtml(item.label) + '</span><strong>+' + item.value.toFixed(1) + '</strong></div>';
      }).join("") + '</div>',
      '</div>',
      '</div>',
      '</div>'
    ].join("");
  }

  function bindEvents() {
    app.querySelectorAll("[data-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.activeTab = button.getAttribute("data-tab");
        saveState();
        render();
      });
    });

    app.querySelectorAll("[data-pick-player]").forEach(function (button) {
      button.addEventListener("click", function () {
        pickPlayer(Number(button.getAttribute("data-pick-player")));
      });
    });

    app.querySelectorAll("[data-pick-manager]").forEach(function (button) {
      button.addEventListener("click", function () {
        pickManager(Number(button.getAttribute("data-pick-manager")));
      });
    });

    app.querySelectorAll("[data-pick-formation]").forEach(function (button) {
      button.addEventListener("click", function () {
        pickFormation(button.getAttribute("data-pick-formation"));
      });
    });

    app.querySelectorAll("[data-slot]").forEach(function (button) {
      bindPlacementSlot(button, "field", "data-slot");
    });

    app.querySelectorAll("[data-bench]").forEach(function (button) {
      bindPlacementSlot(button, "bench", "data-bench");
    });

    app.querySelectorAll("[data-toggle-auto-place]").forEach(function (input) {
      input.addEventListener("change", function () {
        state.autoPlace = Boolean(input.checked);
        saveState();
        render();
      });
    });

    app.querySelectorAll("[data-team-name-input]").forEach(function (input) {
      input.addEventListener("change", function () {
        updateTeamName(input.value);
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
      });
    });

    app.querySelectorAll("[data-action]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        var action = button.getAttribute("data-action");
        if (action === "close-modal" && button.classList.contains("modal-backdrop") && event.target !== button) return;
        if (action === "close-modal") event.stopPropagation();
        runAction(action);
      });
    });

    app.querySelectorAll("[data-inspect-saved]").forEach(function (button) {
      button.addEventListener("click", function () {
        inspectTeam = state.savedTeams[Number(button.getAttribute("data-inspect-saved"))];
        render();
      });
    });

    app.querySelectorAll("[data-sim-saved]").forEach(function (button) {
      button.addEventListener("click", function () {
        simulateMatch(Number(button.getAttribute("data-sim-saved")));
      });
    });

    app.querySelectorAll("[data-inspect-leader]").forEach(function (button) {
      button.addEventListener("click", function () {
        inspectTeam = leaderboardTeams()[Number(button.getAttribute("data-inspect-leader"))];
        render();
      });
    });

    app.querySelectorAll("[data-inspect-tournament-team]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!state.tournament) return;
        inspectTeam = tournamentTeam(state.tournament, button.getAttribute("data-inspect-tournament-team"));
        render();
      });
    });
  }

  function runAction(action) {
    if (action === "reroll") useReroll(false);
    if (action === "paid-reroll") useReroll(true);
    if (action === "smart-reroll") useSmartReroll();
    if (action === "save-team" && ENABLE_SAVED_TEAMS) saveCurrentTeam();
    if (action === "simulate") simulateMatch(0);
    if (action === "simulate-tournament") startTournament();
    if (action === "new-draft") {
      var savedTeams = state.savedTeams || [];
      var bots = state.bots && state.bots.length ? state.bots : generateBotPool();
      var versus = state.versus;
      var activeTab = state.activeTab;
      var connected = versus && versus.connected;
      stopTournamentLive();
      state = newDraftState();
      state.savedTeams = savedTeams;
      state.bots = bots;
      state.tournament = null;
      state.activeTab = activeTab;
      if (connected) {
        state.versus = versus;
        state.versus.phase = "draft";
        state.versus.myReady = false;
        state.versus.opponentReady = false;
        state.versus.opponentTeam = null;
        state.versus.series = null;
        broadcastVersusStatus();
      }
      selectedSource = null;
      saveState();
      render();
    }
    if (action === "refresh-bots") {
      state.bots = generateBotPool();
      saveState();
      render();
    }
    if (action === "start-tournament") startTournament();
    if (action === "close-modal") {
      inspectTeam = null;
      render();
    }
    if (action === "create-versus-room") createVersusRoom();
    if (action === "join-versus-room") promptJoinVersusRoom();
    if (action === "copy-versus-link") copyVersusInviteLink();
    if (action === "leave-versus") leaveVersusRoom();
    if (action === "versus-ready") markVersusReady();
    if (action === "versus-rematch") requestVersusRematch();
  }

  function canEditTeamName() {
    if (state.versus && state.versus.connected && state.versus.myReady) return false;
    return true;
  }

  function updateTeamName(nextName) {
    var trimmed = String(nextName || "").trim().slice(0, 34);
    if (!trimmed || trimmed === state.teamName) return;
    state.teamName = trimmed;
    saveState();
    broadcastVersusStatus();
    render();
  }

  function pickPlayer(playerId) {
    if (isTeamFull(state)) return;
    var player = playerById(playerId);
    if (!player) return;
    burnCurrentStack(playerId);
    if (state.autoPlace) {
      placePlayerOnField(state, player.id);
    } else {
      placePlayerOnBench(state, player.id);
    }
    state.pickedIds.push(player.id);
    selectedSource = null;
    state.currentRoll = isTeamFull(state) ? null : createRoll(state);
    saveState();
    broadcastVersusStatus();
    render();
  }

  function pickManager(managerId) {
    if (state.manager) return;
    state.manager = managerId;
    burnCurrentStack();
    state.draftPhase = "formation";
    state.currentRoll = createRoll(state);
    saveState();
    broadcastVersusStatus();
    render();
  }

  function pickFormation(name) {
    if (state.formationLocked) return;
    var oldSlots = state.slots.slice();
    var selected = cloneFormation(formationByName(name));
    state.formation = selected;
    state.formationLocked = true;
    var fieldPlayers = state.slots.map(function (slot) { return slot.playerId; }).filter(Boolean);
    var benchPlayers = (state.bench || makeBench()).map(function (slot) { return slot.playerId; }).filter(Boolean);
    state.slots = makeSlots(selected);
    if (!state.bench) state.bench = makeBench();
    state.bench.forEach(function (slot) { slot.playerId = null; });
    fieldPlayers.forEach(function (playerId) { placePlayerOnField(state, playerId); });
    benchPlayers.forEach(function (playerId) { placePlayerOnBench(state, playerId); });
    burnCurrentStack();
    state.draftPhase = "players";
    state.currentRoll = createRoll(state);
    selectedSource = null;
    saveState();
    broadcastVersusStatus();
    render();
  }

  function burnCurrentStack(exceptPlayerId) {
    if (!state.currentRoll) return;
    var stack = state.currentRoll.playerIds.slice();
    if (!stack.length) return;
    state.viewedStacks.push(stack.join("-"));
    stack.forEach(function (id) {
      if (id !== exceptPlayerId && state.burnedIds.indexOf(id) === -1) state.burnedIds.push(id);
    });
  }

  function useReroll(paid) {
    if (!state.currentRoll || isTeamFull(state)) return;
    if ((state.freeRerolls || 0) > 0 && !paid) {
      state.freeRerolls -= 1;
    } else if ((state.freeRerolls || 0) > 0 && paid) {
      state.freeRerolls -= 1;
    } else {
      if ((state.paidRerollsAvailable || 0) <= 0) return;
      state.paidRerollsAvailable -= 1;
      state.paidRerollsUsed += 1;
    }
    burnCurrentStack();
    state.currentRoll = createRoll(state);
    saveState();
    broadcastVersusStatus();
    render();
  }

  function useSmartReroll() {
    if (!canReroll()) return;
    useReroll((state.freeRerolls || 0) <= 0);
  }

  function getDraftRef(draft) {
    return draft || state;
  }

  function clearPlayerFromRoster(draft, playerId) {
    var target = getDraftRef(draft);
    target.slots.forEach(function (slot) {
      if (slot.playerId === playerId) slot.playerId = null;
    });
    (target.bench || []).forEach(function (slot) {
      if (slot.playerId === playerId) slot.playerId = null;
    });
  }

  function placePlayerOnBench(draft, playerId) {
    var target = getDraftRef(draft);
    if (!target.bench) target.bench = makeBench();
    clearPlayerFromRoster(target, playerId);
    var empty = target.bench.find(function (slot) { return !slot.playerId; });
    if (!empty) return false;
    empty.playerId = playerId;
    return true;
  }

  function placePlayerOnField(draft, playerId) {
    var target = getDraftRef(draft);
    var player = playerById(playerId);
    if (!player) return false;
    clearPlayerFromRoster(target, playerId);
    var open = target.slots.filter(function (slot) { return !slot.playerId; });
    var targetSlot;
    if (open.length) {
      targetSlot = bestFieldSlotForPlayer(target, player, open);
    } else {
      targetSlot = bestFieldSlotForPlayer(target, player, target.slots);
      if (targetSlot.playerId) placePlayerOnBench(target, targetSlot.playerId);
    }
    targetSlot.playerId = playerId;
    return true;
  }

  function placePlayer(playerId) {
    return placePlayerOnField(state, playerId);
  }

  function bestFieldSlotForPlayer(draft, player, slots) {
    var best = slots[0];
    var bestScore = -Infinity;
    slots.forEach(function (slot) {
      var score = slotScoreForPlayer(draft, player, slot);
      if (score > bestScore) {
        bestScore = score;
        best = slot;
      }
    });
    return best;
  }

  function slotScoreForPlayer(draft, player, slot) {
    var score = effectiveRating(player, slot.pos);
    if (slot.pos === "GK" && player.primary !== "GK") score -= 20;
    if (slot.pos !== "GK" && player.primary === "GK") score -= 80;
    return score + slotChemistryPreview(draft, player, slot);
  }

  function slotChemistryPreview(draft, player, targetSlot) {
    var target = getDraftRef(draft);
    var score = 0;
    target.slots.forEach(function (slot) {
      if (!slot.playerId || slot.slotId === targetSlot.slotId) return;
      var other = playerById(slot.playerId);
      if (!other) return;
      if (other.nation === player.nation) score += 0.5;
      if (hasSharedClub(other, player)) score += 0.5;
    });
    return score;
  }

  function getPlayerAt(kind, index) {
    if (kind === "field") {
      var fieldSlot = state.slots[index];
      return fieldSlot ? fieldSlot.playerId : null;
    }
    var benchSlot = (state.bench || [])[index];
    return benchSlot ? benchSlot.playerId : null;
  }

  function setPlayerAt(kind, index, playerId) {
    if (kind === "field") {
      if (state.slots[index]) state.slots[index].playerId = playerId || null;
      return;
    }
    if (state.bench[index]) state.bench[index].playerId = playerId || null;
  }

  function bindPlacementSlot(button, kind, attr) {
    button.addEventListener("click", function () {
      handlePlacementClick(kind, Number(button.getAttribute(attr)));
    });
    button.addEventListener("dragstart", function (event) {
      var index = Number(button.getAttribute(attr));
      if (!getPlayerAt(kind, index)) {
        event.preventDefault();
        return;
      }
      draggedSource = { kind: kind, index: index };
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", JSON.stringify(draggedSource));
    });
    button.addEventListener("dragover", function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });
    button.addEventListener("drop", function (event) {
      event.preventDefault();
      var fromSource = draggedSource;
      try {
        var parsed = JSON.parse(event.dataTransfer.getData("text/plain") || "null");
        if (parsed && parsed.kind) fromSource = parsed;
      } catch (error) {
        fromSource = draggedSource;
      }
      movePlayer(fromSource, { kind: kind, index: Number(button.getAttribute(attr)) });
    });
    button.addEventListener("dragend", function () {
      draggedSource = null;
    });
  }

  function handlePlacementClick(kind, index) {
    if (!selectedSource) {
      if (getPlayerAt(kind, index)) selectedSource = { kind: kind, index: index };
      render();
      return;
    }
    if (selectedSource.kind === kind && selectedSource.index === index) {
      selectedSource = null;
      render();
      return;
    }
    movePlayer(selectedSource, { kind: kind, index: index });
  }

  function movePlayer(fromSource, toSource) {
    if (!fromSource || !toSource) {
      selectedSource = null;
      render();
      return;
    }
    if (fromSource.kind === toSource.kind && fromSource.index === toSource.index) {
      selectedSource = null;
      render();
      return;
    }
    var fromPlayer = getPlayerAt(fromSource.kind, fromSource.index);
    var toPlayer = getPlayerAt(toSource.kind, toSource.index);
    setPlayerAt(fromSource.kind, fromSource.index, toPlayer || null);
    setPlayerAt(toSource.kind, toSource.index, fromPlayer || null);
    selectedSource = null;
    draggedSource = null;
    saveState();
    broadcastVersusStatus();
    render();
  }

  function effectiveRating(player, slotPos) {
    return player.rating * fitMultiplier(player, slotPos);
  }

  function fitMultiplier(player, slotPos) {
    if (player.primary === slotPos) return 1;
    if (player.secondary.indexOf(slotPos) !== -1) return 0.9;
    if (sameGroup(player.primary, slotPos)) return 0.82;
    if (player.primary === "GK" || slotPos === "GK") return 0.38;
    return 0.74;
  }

  function sameGroup(a, b) {
    return Object.keys(POS_GROUPS).some(function (group) {
      return POS_GROUPS[group].indexOf(a) !== -1 && POS_GROUPS[group].indexOf(b) !== -1;
    });
  }

  function calculateRating(draft) {
    var base = 0;
    var peak = 0;
    var placed = draft.slots.map(function (slot) {
      var player = playerById(slot.playerId);
      if (!player) return null;
      var effective = effectiveRating(player, slot.pos);
      base += effective;
      peak += player.rating;
      return { slot: slot, player: player, effective: effective };
    }).filter(Boolean);

    var clubChem = linkedChemistry(placed, "club");
    var nationChem = linkedChemistry(placed, "nation");
    var lineChem = calculateLineChemistry(placed);
    var combos = calculateCombos(placed);
    var managerConnection = calculateManagerConnection(placed, draft.manager);
    var experience = draft.experience || 0;
    var total = base + clubChem + nationChem + lineChem + combos.total + managerConnection.bonus + experience;
    return {
      base: base,
      total: total,
      positionLoss: Math.max(0, peak - base),
      chemistry: clubChem + nationChem + lineChem,
      clubChem: clubChem,
      nationChem: nationChem,
      lineChem: lineChem,
      combos: combos.total,
      comboItems: combos.items,
      managerBonus: managerConnection.bonus,
      managerSynergy: managerConnection.synergy,
      managerHitDetail: managerConnection.hitDetail,
      managerHits: managerConnection.hits,
      experience: experience
    };
  }

  function linkedChemistry(placed, mode) {
    var counts = {};
    placed.forEach(function (entry) {
      if (mode === "nation") {
        counts[entry.player.nation] = (counts[entry.player.nation] || 0) + 1;
      } else {
        entry.player.clubs.forEach(function (club) {
          counts[club] = (counts[club] || 0) + 1;
        });
      }
    });
    return Object.keys(counts).reduce(function (sum, key) {
      var count = counts[key];
      return count >= 2 ? sum + (count - 1) : sum;
    }, 0);
  }

  function calculateLineChemistry(placed) {
    var lines = {
      front: placed.filter(function (entry) { return POS_GROUPS.ATT.indexOf(entry.slot.pos) !== -1; }),
      mid: placed.filter(function (entry) { return POS_GROUPS.MID.indexOf(entry.slot.pos) !== -1; }),
      def: placed.filter(function (entry) { return POS_GROUPS.DEF.indexOf(entry.slot.pos) !== -1; })
    };
    var points = 0;
    Object.keys(lines).forEach(function (line) {
      var group = lines[line];
      if (group.length < 3) return;
      if (hasSharedNation(group) || hasCommonClub(group) || hasSharedTag(group)) points += 3;
    });
    return points;
  }

  function calculateCombos(placed) {
    var ids = new Set(placed.map(function (entry) { return entry.player.id; }));
    var tagCounts = {};
    placed.forEach(function (entry) {
      entry.player.tags.forEach(function (tag) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    var items = [];
    comboRules.forEach(function (rule) {
      var hasRequired = rule.requiredIds.every(function (id) { return ids.has(id); });
      var tagHit = rule.tags.some(function (tag) { return (tagCounts[tag] || 0) >= rule.minCount; });
      if (hasRequired || tagHit) items.push({ label: rule.name, value: rule.points });
    });
    return { total: items.reduce(function (sum, item) { return sum + item.value; }, 0), items: items };
  }

  function calculateManagerConnection(placed, managerId) {
    var empty = { synergy: 0, bonus: 0, hits: [], hitDetail: "No manager selected" };
    if (!managerId || !placed.length) return empty;
    var manager = managerById(managerId);
    if (!manager) return empty;

    var links = manager.links || [];
    var hits = links.map(function (link) {
      var count = placed.filter(function (entry) {
        return playerMatchesManagerLink(entry.player, link);
      }).length;
      return {
        link: link,
        count: count,
        matched: Math.min(count, MANAGER_LINK_PLAYER_CAP)
      };
    });

    var maxMatched = links.length * MANAGER_LINK_PLAYER_CAP;
    var matchedTotal = hits.reduce(function (sum, hit) { return sum + hit.matched; }, 0);
    var fitRatio = maxMatched ? matchedTotal / maxMatched : 0;
    var synergy = Math.round(fitRatio * 100) / 10;
    var hitDetail = hits.map(function (hit) {
      return formatManagerLink(hit.link) + " " + hit.count + "/" + MANAGER_LINK_PLAYER_CAP;
    }).join(" · ");

    return {
      synergy: synergy,
      bonus: synergy,
      hits: hits,
      hitDetail: hitDetail,
      fitRatio: fitRatio
    };
  }

  function hasSharedClub(a, b) {
    return a.clubs.some(function (club) { return b.clubs.indexOf(club) !== -1; });
  }

  function hasSharedNation(group) {
    var counts = {};
    group.forEach(function (entry) { counts[entry.player.nation] = (counts[entry.player.nation] || 0) + 1; });
    return Object.keys(counts).some(function (key) { return counts[key] >= 3; });
  }

  function hasCommonClub(group) {
    var counts = {};
    group.forEach(function (entry) {
      entry.player.clubs.forEach(function (club) { counts[club] = (counts[club] || 0) + 1; });
    });
    return Object.keys(counts).some(function (key) { return counts[key] >= 3; });
  }

  function hasSharedTag(group) {
    var counts = {};
    group.forEach(function (entry) {
      entry.player.tags.forEach(function (tag) { counts[tag] = (counts[tag] || 0) + 1; });
    });
    return Object.keys(counts).some(function (key) { return counts[key] >= 3; });
  }

  function pickedCount(draft) {
    return (draft.pickedIds || []).length;
  }

  function filledCount(draft) {
    return draft.slots.filter(function (slot) { return Boolean(slot.playerId); }).length;
  }

  function benchFilledCount(draft) {
    return (draft.bench || []).filter(function (slot) { return Boolean(slot.playerId); }).length;
  }

  function isTeamFull(draft) {
    return pickedCount(draft) >= 11;
  }

  function isFieldComplete(draft) {
    return filledCount(draft) >= 11;
  }

  function reconcileBench(draft) {
    if (!draft.bench) draft.bench = makeBench();
    (draft.pickedIds || []).forEach(function (playerId) {
      var onField = draft.slots.some(function (slot) { return slot.playerId === playerId; });
      var onBench = draft.bench.some(function (slot) { return slot.playerId === playerId; });
      if (!onField && !onBench) placePlayerOnBench(draft, playerId);
    });
  }

  function saveCurrentTeam() {
    if (!isFieldComplete(state)) return;
    var nextName = window.prompt("Save team as", state.teamName);
    if (!nextName) return;
    state.teamName = nextName.trim().slice(0, 34) || state.teamName;
    var team = snapshotTeam(state, "You");
    state.savedTeams = [team];
    saveState();
    render();
  }

  function snapshotTeam(draft, owner) {
    var rating = calculateRating(draft);
    var manager = draft.manager ? managerById(draft.manager) : null;
    return {
      id: "team-" + Date.now() + "-" + Math.random().toString(16).slice(2),
      name: draft.teamName,
      owner: owner,
      formation: draft.formation.name,
      manager: manager ? manager.name : "None",
      rating: rating.total,
      experience: draft.experience || 0,
      record: draft.record || { w: 0, l: 0 },
      players: draft.slots.map(function (slot) {
        var player = playerById(slot.playerId);
        return { id: player.id, name: player.name, slot: slot.pos, effective: effectiveRating(player, slot.pos), rating: player.rating };
      }),
      bonuses: [
        { label: "Club chemistry", value: rating.clubChem },
        { label: "Nation chemistry", value: rating.nationChem },
        { label: "Line chemistry", value: rating.lineChem },
        { label: "Combos", value: rating.combos },
        { label: "Manager", value: rating.managerBonus }
      ].concat(rating.comboItems)
    };
  }

  function simulateMatch(savedIndex) {
    var team = state.savedTeams[savedIndex] || (isFieldComplete(state) ? snapshotTeam(state, "You") : null);
    if (!team) return;
    if (!state.bots || !state.bots.length) state.bots = generateBotPool();
    state.bots = ensureBotTeamNames(state.bots);
    var opponent = sample(state.bots, 1)[0];
    var odds = winProbability(team.rating, opponent.rating);
    var won = Math.random() < odds;
    var score = scoreline(won, odds);
    team.record = team.record || { w: 0, l: 0 };
    if (won) {
      team.record.w += 1;
      team.experience = (team.experience || 0) + 0.1;
      team.rating += 0.1;
    } else {
      team.record.l += 1;
    }
    if (state.savedTeams[savedIndex]) state.savedTeams[savedIndex] = team;
    state.matchLog.unshift({
      home: team.name,
      away: opponent.name,
      score: score,
      result: won ? "W" : "L",
      odds: Math.round(odds * 100),
      rating: team.rating
    });
    saveState();
    render();
  }

  function getPlayableTeam() {
    if (isFieldComplete(state)) return cloneTournamentTeam(snapshotTeam(state, "You"), true);
    if (ENABLE_SAVED_TEAMS && state.savedTeams && state.savedTeams.length) {
      return cloneTournamentTeam(state.savedTeams[0], true);
    }
    return null;
  }

  function startTournament() {
    stopTournamentLive();
    var userTeam = getPlayableTeam();
    if (!userTeam) return;
    var bots = getTournamentBotStack(15).map(function (team) {
      return cloneTournamentTeam(team, false);
    });
    var teams = [userTeam].concat(bots).map(function (team, index) {
      team.tournamentId = index === 0 ? "user" : "bot-" + index;
      return team;
    });
    var shuffledBots = sample(teams.slice(1), teams.length - 1);
    var ordered = [teams[0]].concat(shuffledBots);
    var tournament = createTournamentFromTeams(ordered, {
      title: "Cup started",
      detail: userTeam.name + " entered the draw."
    });
    state.tournament = tournament;
    state.activeTab = "solo";
    scheduleTournamentStep();
    saveState();
    render();
  }

  function createTournamentFromTeams(orderedTeams, logEntry) {
    var groups = ["Group A", "Group B", "Group C", "Group D"].map(function (name, groupIndex) {
      return {
        name: name,
        teamIds: orderedTeams.slice(groupIndex * 4, groupIndex * 4 + 4).map(function (team) { return team.tournamentId; })
      };
    });
    var tournament = {
      id: "cup-" + Date.now(),
      stage: "groups",
      played: 0,
      totalMatches: 31,
      teams: orderedTeams,
      groups: groups,
      groupMatches: buildGroupMatches(groups),
      bracketRounds: buildEmptyBracket(),
      activeRoundIndex: 0,
      championId: null,
      championName: "",
      log: []
    };
    ensureTournamentTeamNames(tournament);
    if (logEntry) {
      tournament.log.unshift({ stage: "Cup", title: logEntry.title, detail: logEntry.detail, user: true });
    }
    return tournament;
  }

  function runTournamentToCompletion(tournament) {
    var guard = 0;
    while (tournament.stage !== "complete" && guard < 64) {
      advanceTournamentStep(tournament);
      guard += 1;
    }
    return tournament;
  }

  function cloneTournamentTeam(team, user) {
    return {
      id: team.id,
      tournamentId: "",
      name: team.name || (user ? state.teamName : "AI XI"),
      owner: team.owner || (user ? "You" : "AI Draft"),
      formation: team.formation,
      manager: team.manager,
      rating: team.rating,
      experience: team.experience || 0,
      record: team.record || { w: 0, l: 0 },
      players: team.players || [],
      bonuses: team.bonuses || [],
      user: user
    };
  }

  function buildGroupMatches(groups) {
    var matches = [];
    groups.forEach(function (group) {
      for (var i = 0; i < group.teamIds.length; i += 1) {
        for (var j = i + 1; j < group.teamIds.length; j += 1) {
          matches.push({ stage: group.name, group: group.name, homeId: group.teamIds[i], awayId: group.teamIds[j], played: false, score: "", winnerId: null, draw: false });
        }
      }
    });
    return matches;
  }

  function buildEmptyBracket() {
    return [
      { name: "Quarterfinals", matches: [] },
      { name: "Semifinals", matches: [] },
      { name: "Final", matches: [] }
    ];
  }

  function advanceTournamentStep(tournamentOverride) {
    var tournament = tournamentOverride || state.tournament;
    if (!tournament || tournament.stage === "complete") return;
    if (tournament.stage === "groups") {
      var nextGroupMatch = tournament.groupMatches.find(function (match) { return !match.played; });
      if (nextGroupMatch) {
        playTournamentMatch(tournament, nextGroupMatch, true);
        return;
      }
      seedKnockout(tournament);
      tournament.stage = "knockout";
      tournament.log.unshift({ stage: "Cup", title: "Group stage complete", detail: knockoutStatusText(tournament), user: true });
      return;
    }

    var round = tournament.bracketRounds[tournament.activeRoundIndex];
    if (!round) return;
    var nextKnockout = round.matches.find(function (match) { return !match.played && match.homeId && match.awayId; });
    if (nextKnockout) {
      playTournamentMatch(tournament, nextKnockout, false);
      if (round.matches.every(function (match) { return match.played; })) completeBracketRound(tournament);
      return;
    }
    if (round.matches.length === 0) completeBracketRound(tournament);
  }

  function playTournamentMatch(tournament, match, allowDraw) {
    var home = tournamentTeam(tournament, match.homeId);
    var away = tournamentTeam(tournament, match.awayId);
    if (!home || !away) return;
    var result = simulateTournamentResult(home, away, allowDraw, tournament._rng);
    match.played = true;
    match.score = result.score;
    match.winnerId = result.winnerId;
    match.draw = result.draw;
    tournament.played += 1;
    tournament.log.unshift({
      stage: match.stage,
      title: home.name + " " + result.score + " " + away.name,
      detail: result.draw ? "Group-stage draw." : tournamentTeam(tournament, result.winnerId).name + " won with " + Math.round(result.odds * 100) + "% pre-match odds.",
      user: home.user || away.user
    });
  }

  function simulateTournamentResult(home, away, allowDraw, rng) {
    var roll = typeof rng === "function" ? rng : Math.random;
    var odds = winProbability(home.rating, away.rating);
    if (allowDraw && roll() < 0.18) {
      var drawGoals = roll() < 0.6 ? 1 : 2;
      return { draw: true, winnerId: null, score: drawGoals + "-" + drawGoals, odds: odds };
    }
    var homeWon = roll() < odds;
    var score = tournamentScoreline(homeWon, odds);
    return { draw: false, winnerId: homeWon ? home.tournamentId : away.tournamentId, score: score, odds: homeWon ? odds : 1 - odds };
  }

  function tournamentScoreline(homeWon, odds) {
    var close = Math.abs(odds - 0.5) < 0.1;
    if (homeWon) return close ? "2-1" : "3-1";
    return close ? "1-2" : "0-2";
  }

  function seedKnockout(tournament) {
    var tables = tournament.groups.map(function (group) { return groupTable(tournament, group); });
    var seeds = {
      A1: tables[0][0].team.tournamentId,
      A2: tables[0][1].team.tournamentId,
      B1: tables[1][0].team.tournamentId,
      B2: tables[1][1].team.tournamentId,
      C1: tables[2][0].team.tournamentId,
      C2: tables[2][1].team.tournamentId,
      D1: tables[3][0].team.tournamentId,
      D2: tables[3][1].team.tournamentId
    };
    tournament.bracketRounds[0].matches = [
      bracketMatch("Quarterfinals", seeds.A1, seeds.B2),
      bracketMatch("Quarterfinals", seeds.C1, seeds.D2),
      bracketMatch("Quarterfinals", seeds.B1, seeds.A2),
      bracketMatch("Quarterfinals", seeds.D1, seeds.C2)
    ];
  }

  function bracketMatch(stage, homeId, awayId) {
    return { stage: stage, homeId: homeId, awayId: awayId, played: false, score: "", winnerId: null, draw: false };
  }

  function completeBracketRound(tournament) {
    var roundIndex = tournament.activeRoundIndex;
    var round = tournament.bracketRounds[roundIndex];
    var winners = round.matches.map(function (match) { return match.winnerId; }).filter(Boolean);
    if (roundIndex === 0) {
      tournament.bracketRounds[1].matches = [
        bracketMatch("Semifinals", winners[0], winners[1]),
        bracketMatch("Semifinals", winners[2], winners[3])
      ];
      tournament.activeRoundIndex = 1;
      tournament.log.unshift({ stage: "Cup", title: "Semifinals set", detail: knockoutStatusText(tournament), user: true });
      return;
    }
    if (roundIndex === 1) {
      tournament.bracketRounds[2].matches = [bracketMatch("Final", winners[0], winners[1])];
      tournament.activeRoundIndex = 2;
      tournament.log.unshift({ stage: "Cup", title: "Final set", detail: knockoutStatusText(tournament), user: true });
      return;
    }
    tournament.championId = winners[0] || null;
    tournament.championName = tournament.championId ? tournamentTeam(tournament, tournament.championId).name : "";
    tournament.stage = "complete";
    stopTournamentLive();
    var viewerId = viewerTeamId(tournament);
    tournament.log.unshift({ stage: "Final", title: tournament.championName + " won the cup", detail: tournament.championId === viewerId ? "Your XI lifted the trophy." : "Your XI fell short this run.", user: tournament.championId === viewerId });
  }

  function viewerTeamId(tournament) {
    return (tournament && tournament.viewerTeamId) || "user";
  }

  function groupTable(tournament, group) {
    var rows = {};
    group.teamIds.forEach(function (id) {
      rows[id] = { team: tournamentTeam(tournament, id), pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0 };
    });
    tournament.groupMatches.filter(function (match) { return match.group === group.name && match.played; }).forEach(function (match) {
      var score = match.score.split("-").map(Number);
      var home = rows[match.homeId];
      var away = rows[match.awayId];
      home.gf += score[0];
      home.ga += score[1];
      away.gf += score[1];
      away.ga += score[0];
      if (match.draw) {
        home.pts += 1;
        away.pts += 1;
        home.d += 1;
        away.d += 1;
      } else if (match.winnerId === match.homeId) {
        home.pts += 3;
        home.w += 1;
        away.l += 1;
      } else {
        away.pts += 3;
        away.w += 1;
        home.l += 1;
      }
    });
    return Object.keys(rows).map(function (id) {
      rows[id].gd = rows[id].gf - rows[id].ga;
      return rows[id];
    }).sort(function (a, b) {
      return b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.team.rating - a.team.rating;
    });
  }

  function tournamentTeam(tournament, id) {
    return tournament.teams.find(function (team) { return team.tournamentId === id; }) || null;
  }

  function tournamentStageLabel(tournament) {
    if (tournament.stage === "complete") return "Complete";
    if (tournament.stage === "groups") return "Groups";
    var round = tournament.bracketRounds[tournament.activeRoundIndex];
    return round ? round.name : "Bracket";
  }

  function tournamentUserProgress(tournament) {
    var context = userGroupContext(tournament);
    var userState = tournamentUserState(tournament);
    var viewerId = viewerTeamId(tournament);
    var summary = "Your XI is waiting for the tournament draw.";
    if (tournament.championId === viewerId) {
      summary = "Your XI won the final and lifted the cup.";
    } else if (tournament.stage === "complete") {
      summary = "Your XI is out. Champion: " + (tournament.championName || "TBD") + ".";
    } else if (tournament.stage === "groups" && context.group) {
      if (context.played === 0) {
        summary = context.group.name + " is about to start. Top two teams advance.";
      } else {
        summary = context.group.name + ": #" + (context.rank + 1) + " with " + context.row.pts + " pts after " + context.played + "/3 matches.";
      }
    } else if (userState.label === "Out") {
      var knockoutLoss = lastUserBracketMatch(tournament);
      summary = knockoutLoss ? "Eliminated in " + knockoutLoss.stage + " by " + matchOpponentName(tournament, knockoutLoss) + "." : context.group ? "Finished #" + (context.rank + 1) + " in " + context.group.name + " and missed the bracket." : "Your XI has been eliminated.";
    } else {
      var nextMatch = nextUserTournamentMatch(tournament);
      summary = nextMatch ? "Alive in " + nextMatch.stage + " against " + matchOpponentName(tournament, nextMatch) + "." : "Alive and waiting for the next bracket matchup.";
    }
    return {
      summary: summary,
      tone: userState.tone,
      items: userPathItems(tournament)
    };
  }

  function userGroupContext(tournament) {
    var viewerId = viewerTeamId(tournament);
    var group = tournament.groups.find(function (item) { return item.teamIds.indexOf(viewerId) !== -1; });
    var table = group ? groupTable(tournament, group) : [];
    var rank = table.findIndex(function (row) { return row.team.user; });
    var matches = group ? tournament.groupMatches.filter(function (match) {
      return match.group === group.name && (match.homeId === viewerId || match.awayId === viewerId);
    }) : [];
    return {
      group: group,
      table: table,
      rank: rank,
      row: rank >= 0 ? table[rank] : { pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 },
      matches: matches,
      played: matches.filter(function (match) { return match.played; }).length
    };
  }

  function userPathItems(tournament) {
    var context = userGroupContext(tournament);
    var items = context.matches.map(function (match) {
      return userMatchPathItem(tournament, match);
    });
    var hasBracketMatch = false;
    var viewerId = viewerTeamId(tournament);
    tournament.bracketRounds.forEach(function (round) {
      round.matches.forEach(function (match) {
        if (match.homeId !== viewerId && match.awayId !== viewerId) return;
        hasBracketMatch = true;
        items.push(userMatchPathItem(tournament, match));
      });
    });
    if (tournament.stage !== "groups" && !hasBracketMatch && tournamentUserState(tournament).label === "Out") {
      items.push({ label: "Knockout", detail: "Did not qualify", status: "loss" });
    }
    return items;
  }

  function userMatchPathItem(tournament, match) {
    if (!match.played) {
      return { label: match.stage, detail: "vs " + matchOpponentName(tournament, match) + " pending", status: "pending" };
    }
    if (match.draw) {
      return { label: match.stage, detail: userScoreText(tournament, match), status: "draw" };
    }
    return {
      label: match.stage,
      detail: userScoreText(tournament, match),
      status: match.winnerId === viewerTeamId(tournament) ? "win" : "loss"
    };
  }

  function userScoreText(tournament, match) {
    var opponent = matchOpponentName(tournament, match);
    var score = match.score.split("-");
    var userHome = match.homeId === viewerTeamId(tournament);
    var userGoals = userHome ? score[0] : score[1];
    var opponentGoals = userHome ? score[1] : score[0];
    return "vs " + opponent + " " + userGoals + "-" + opponentGoals;
  }

  function matchOpponentName(tournament, match) {
    var viewerId = viewerTeamId(tournament);
    var opponentId = match.homeId === viewerId ? match.awayId : match.homeId;
    var opponent = tournamentTeam(tournament, opponentId);
    return opponent ? opponent.name : "TBD";
  }

  function nextUserTournamentMatch(tournament) {
    var viewerId = viewerTeamId(tournament);
    var groupMatch = tournament.groupMatches.find(function (match) {
      return !match.played && (match.homeId === viewerId || match.awayId === viewerId);
    });
    if (groupMatch) return groupMatch;
    for (var i = 0; i < tournament.bracketRounds.length; i += 1) {
      var match = tournament.bracketRounds[i].matches.find(function (item) {
        return !item.played && (item.homeId === viewerId || item.awayId === viewerId);
      });
      if (match) return match;
    }
    return null;
  }

  function lastUserBracketMatch(tournament) {
    var viewerId = viewerTeamId(tournament);
    var lastMatch = null;
    tournament.bracketRounds.forEach(function (round) {
      round.matches.forEach(function (match) {
        if (match.played && (match.homeId === viewerId || match.awayId === viewerId)) lastMatch = match;
      });
    });
    return lastMatch && lastMatch.winnerId !== viewerId ? lastMatch : null;
  }

  function tournamentUserState(tournament) {
    var viewerId = viewerTeamId(tournament);
    if (tournament.championId === viewerId) return { label: "Champion", tone: "gold" };
    if (tournament.stage === "complete") return { label: "Out", tone: "red" };
    if (tournament.stage === "groups") {
      var group = tournament.groups.find(function (item) { return item.teamIds.indexOf(viewerId) !== -1; });
      var table = group ? groupTable(tournament, group) : [];
      var rank = table.findIndex(function (row) { return row.team.user; });
      return { label: rank >= 0 ? "#" + (rank + 1) + " group" : "Groups", tone: rank >= 0 && rank < 2 ? "green" : "" };
    }
    var hasBracketPath = false;
    var hasPendingMatch = false;
    var lostKnockoutMatch = false;
    tournament.bracketRounds.forEach(function (round) {
      round.matches.forEach(function (match) {
        var involvesUser = match.homeId === viewerId || match.awayId === viewerId;
        if (!involvesUser) return;
        hasBracketPath = true;
        if (!match.played) hasPendingMatch = true;
        if (match.played && match.winnerId !== viewerId) lostKnockoutMatch = true;
      });
    });
    var alive = hasBracketPath && !lostKnockoutMatch && (hasPendingMatch || tournament.bracketRounds.some(function (round) {
      return round.matches.some(function (match) { return match.played && match.winnerId === viewerId; });
    }));
    return { label: alive ? "Alive" : "Out", tone: alive ? "green" : "red" };
  }

  function knockoutStatusText(tournament) {
    var user = tournamentUserState(tournament);
    return "Your XI is " + user.label.toLowerCase() + ".";
  }

  function toggleTournamentLive() {
    if (tournamentTimer) {
      stopTournamentLive();
      render();
      return;
    }
    scheduleTournamentStep();
    render();
  }

  function scheduleTournamentStep() {
    stopTournamentLive();
    if (!state.tournament || state.tournament.stage === "complete") {
      if (state.tournament && state.tournament.stage === "complete" && state.versus && state.versus.phase === "cup") {
        finishVersusWorldCup();
      }
      return;
    }
    tournamentTimer = window.setTimeout(function () {
      tournamentTimer = null;
      advanceTournamentStep();
      if (state.tournament && state.tournament.stage === "complete" && state.versus && state.versus.phase === "cup") {
        finishVersusWorldCup();
      } else {
        saveState();
        scheduleTournamentStep();
      }
      render();
    }, 520);
  }

  function stopTournamentLive() {
    if (!tournamentTimer) return;
    window.clearTimeout(tournamentTimer);
    tournamentTimer = null;
  }

  function winProbability(a, b) {
    return 1 / (1 + Math.pow(10, (b - a) / 400));
  }

  function scoreline(won, odds) {
    var close = Math.abs(odds - 0.5) < 0.08;
    if (won) return close ? "2-1" : "3-1";
    return close ? "1-2" : "0-2";
  }

  function leaderboardTeams() {
    return state.savedTeams.concat(state.bots || []).slice().sort(function (a, b) {
      return b.rating - a.rating || b.record.w - a.record.w;
    });
  }

  function generateBotPool() {
    var bots = [];
    var usedNames = {};
    for (var i = 0; i < BOT_COUNT; i += 1) {
      bots.push(generateBotTeam(i + 1, usedNames));
    }
    return bots.sort(function (a, b) { return b.rating - a.rating; });
  }

  function getTournamentBotStack(count) {
    if (!state.bots || state.bots.length < count) state.bots = generateBotPool();
    state.bots = ensureBotTeamNames(state.bots);
    return sample(state.bots, count);
  }

  function ensureBotTeamNames(bots) {
    var usedNames = {};
    return bots.map(function (team) {
      if (team.name && !/^Bot XI\s+\d+$/i.test(team.name) && !usedNames[team.name]) {
        usedNames[team.name] = true;
        return team;
      }
      team.name = randomBotTeamName(usedNames);
      return team;
    });
  }

  function ensureTournamentTeamNames(tournament) {
    if (!tournament || !tournament.teams) return tournament;
    var usedNames = {};
    tournament.teams.forEach(function (team) {
      if (team.user || team.tournamentId === "user" || team.tournamentId === "player-a" || team.tournamentId === "player-b") {
        team.name = team.name || state.teamName || "Your Team";
        usedNames[team.name] = true;
        return;
      }
      if (!team.name || /^Bot XI\s+\d+$/i.test(team.name) || usedNames[team.name]) {
        team.name = randomBotTeamName(usedNames);
      } else {
        usedNames[team.name] = true;
      }
    });
    return tournament;
  }

  function randomBotTeamName(usedNames) {
    var attempts = 0;
    while (attempts < 80) {
      var name = sample(BOT_NAME_PREFIXES, 1)[0] + " " + sample(BOT_NAME_SUFFIXES, 1)[0];
      if (!usedNames[name]) {
        usedNames[name] = true;
        return name;
      }
      attempts += 1;
    }
    var fallback = "Draft Club " + String(Object.keys(usedNames).length + 1).padStart(2, "0");
    usedNames[fallback] = true;
    return fallback;
  }

  function generateBotTeam(index, usedNames) {
    var formation = cloneFormation(sample(formations, 1)[0]);
    var draft = {
      teamName: randomBotTeamName(usedNames || {}),
      draftPhase: "players",
      formation: formation,
      manager: sample(managers, 1)[0].id,
      formationLocked: true,
      slots: makeSlots(formation),
      pickedIds: [],
      burnedIds: [],
      viewedStacks: [],
      currentRoll: null,
      freeRerolls: FREE_REROLLS,
      paidRerollsAvailable: 0,
      paidRerollsUsed: 0,
      experience: Math.random() < 0.24 ? 0.4 : 0,
      record: { w: Math.floor(Math.random() * 9), l: Math.floor(Math.random() * 6) }
    };
    while (pickedCount(draft) < 11) {
      draft.currentRoll = createRoll(draft);
      var best = draft.currentRoll.playerIds.map(playerById).filter(Boolean).sort(function (a, b) {
        return bestOpenSlotRating(draft, b) - bestOpenSlotRating(draft, a);
      })[0];
      burnStackForDraft(draft, best.id);
      placePlayerForDraft(draft, best.id);
      draft.pickedIds.push(best.id);
    }
    return snapshotTeam(draft, "AI Draft");
  }

  function bestOpenSlotRating(draft, player) {
    return Math.max.apply(null, draft.slots.filter(function (slot) { return !slot.playerId; }).map(function (slot) {
      return effectiveRating(player, slot.pos);
    }));
  }

  function burnStackForDraft(draft, exceptPlayerId) {
    draft.currentRoll.playerIds.forEach(function (id) {
      if (id !== exceptPlayerId && draft.burnedIds.indexOf(id) === -1) draft.burnedIds.push(id);
    });
  }

  function placePlayerForDraft(draft, playerId) {
    if (!draft.bench) draft.bench = makeBench();
    placePlayerOnField(draft, playerId);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateForStorage()));
    } catch (error) {
      console.warn("Could not save state", error);
    }
  }

  function stateForStorage() {
    if (!state.versus || !state.versus.cupResult || !state.versus.cupResult.tournament) return state;
    return Object.assign({}, state, {
      versus: Object.assign({}, state.versus, {
        cupResult: cupResultForPeer(state.versus.cupResult)
      })
    });
  }

  function cupResultForPeer(cupResult) {
    if (!cupResult) return null;
    return {
      championId: cupResult.championId,
      championName: cupResult.championName,
      players: cupResult.players
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("xi-roulette-state-v3");
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed.slots || !parsed.formation) return null;
      if (!parsed.bots || !parsed.bots.length) parsed.bots = generateBotPool();
      if (averageTeamRating(parsed.bots) < 850) parsed.bots = generateBotPool();
      parsed.bots = ensureBotTeamNames(parsed.bots);
      if (!parsed.savedTeams) parsed.savedTeams = [];
      if (!parsed.matchLog) parsed.matchLog = [];
      if (!Object.prototype.hasOwnProperty.call(parsed, "paidRerollsAvailable")) parsed.paidRerollsAvailable = 0;
      if (!Object.prototype.hasOwnProperty.call(parsed, "formationLocked")) {
        parsed.formationLocked = Boolean(parsed.formation && parsed.formation.name !== formations[0].name);
      }
      parsed.draftPhase = isTeamFull(parsed) ? "players" : draftPhaseFromState(parsed);
      if (parsed.currentRoll) {
        if (!parsed.currentRoll.managers) parsed.currentRoll.managers = [];
        if (!parsed.currentRoll.formations) parsed.currentRoll.formations = [];
      }
      if (!Object.prototype.hasOwnProperty.call(parsed, "tournament")) parsed.tournament = null;
      if (!parsed.versus) parsed.versus = defaultVersusState();
      if (parsed.versus && parsed.versus.connected) parsed.versus.connected = false;
      if (!parsed.bench) parsed.bench = makeBench();
      if (typeof parsed.autoPlace !== "boolean") parsed.autoPlace = true;
      reconcileBench(parsed);
      if (parsed.tournament) parsed.tournament = ensureTournamentTeamNames(parsed.tournament);
      if (!parsed.currentRoll || !isRollForPhase(parsed.currentRoll, parsed.draftPhase)) {
        if (!isTeamFull(parsed)) parsed.currentRoll = createRoll(parsed);
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function isRollForPhase(roll, phase) {
    if (!roll) return false;
    if (phase === "manager") return (roll.managers || []).length > 0 && !(roll.playerIds || []).length;
    if (phase === "formation") return (roll.formations || []).length > 0 && !(roll.playerIds || []).length;
    return (roll.playerIds || []).length > 0;
  }

  function averageTeamRating(teams) {
    if (!teams || !teams.length) return 0;
    return teams.reduce(function (sum, team) { return sum + (team.rating || 0); }, 0) / teams.length;
  }

  function renderVersusView(rating, teamFull) {
    if (!state.versus.connected) return renderVersusLobby();
    var rightPanel;
    if (state.versus.phase === "done" && state.versus.cupResult) {
      rightPanel = renderVersusResultsPanel();
    } else if (state.versus.phase === "cup" && state.tournament) {
      rightPanel = renderVersusTournamentPanel();
    } else if (state.versus.phase === "series" || state.versus.series) {
      rightPanel = renderVersusSeriesPanel();
    } else {
      rightPanel = renderVersusDraftPanel(teamFull);
    }
    return [
      '<main class="main-grid versus-grid">',
      renderFieldPanel(rating),
      rightPanel,
      '</main>',
      '<section class="bottom-grid">',
      renderVersusStatusPanel(),
      '</section>'
    ].join("");
  }

  function renderVersusLobby() {
    var versus = state.versus;
    var inviteUrl = versus.roomId ? buildVersusInviteUrl(versus.roomId) : "";
    var hosting = Boolean(versus.roomId && versus.role === "host");
    var localFile = isLocalFileGame();
    return [
      '<main class="versus-lobby">',
      '<section class="panel versus-lobby-panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>1v1 Friend Draft</h2><small>Bo5 head-to-head, then a random World Cup draw</small></div></div></div>',
      '<div class="versus-lobby-body">',
      '<div class="notice">Honor-system mode for friends. Both players draft on their own screen, play a Bo5 series, then both XIs are randomly placed into a 16-team World Cup. Final standings show the head-to-head winner and each cup run.</div>',
      localFile ? '<div class="notice versus-local-notice">You opened the game from a folder on your computer. Invite links with that folder path only work on your machine. Share the <strong>room code</strong> instead, or host the game on a public web link so one-click invites work.</div>' : "",
      versus.error ? '<div class="versus-error">' + escapeHtml(versus.error) + '</div>' : "",
      '<div class="versus-lobby-grid">',
      '<div class="versus-card">',
      '<div class="section-label">Host a room</div>',
      '<p>' + (localFile ? "Create a room, then send your friend the 4-digit code." : "Create a room and send the 4-digit code or invite link to a friend on another device.") + '</p>',
      '<button class="primary-button" data-action="create-versus-room">Create Room</button>',
      hosting ? [
        '<div class="versus-room-code-box">',
        '<span>Room code</span>',
        '<strong>' + escapeHtml(versus.roomId) + '</strong>',
        '</div>',
        inviteUrl ? [
          '<div class="versus-link-box">',
          '<input class="versus-link-input" type="text" readonly value="' + escapeHtml(inviteUrl) + '">',
          '<button class="ghost-button" data-action="copy-versus-link">Copy Link</button>',
          '</div>'
        ].join("") : '<button class="ghost-button" data-action="copy-versus-link">Copy Invite Instructions</button>',
        '<div class="versus-waiting">Waiting for friend to join' + (localFile ? " with that code" : "") + '…</div>'
      ].join("") : "",
      '</div>',
      '<div class="versus-card">',
      '<div class="section-label">Join a friend</div>',
      '<p>Open the game on your device, then enter the 4-digit code your friend sent you' + (localFile ? "." : ", or open their invite URL directly.") + '</p>',
      '<button class="ghost-button" data-action="join-versus-room">Join With Code</button>',
      '</div>',
      '</div>',
      '<div class="versus-help">Requires an internet connection. PeerJS connects your browsers directly — no XI Cup game server yet.</div>',
      '</div>',
      '</section>',
      '</main>'
    ].join("");
  }

  function renderVersusDraftPanel(teamFull) {
    var versus = state.versus;
    if (teamFull) {
      var lineupReady = isFieldComplete(state);
      return [
        '<aside class="panel draft-panel">',
        '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>Draft Complete</h2><small>Lock your XI for the Bo5 and World Cup run.</small></div></div></div>',
        '<div class="draft-body">',
        '<div class="versus-ready-grid">',
        metric("You", versus.myReady ? "Ready" : "Not ready", versus.myReady ? "green" : ""),
        metric("Opponent", versus.opponentReady ? "Ready" : versus.opponentProgress + "/11", versus.opponentReady ? "green" : ""),
        '</div>',
        '<div class="notice">' + (versus.myReady ? "Waiting for your opponent to lock in." : lineupReady ? "Review your XI, then lock in when you are happy with the squad." : "Move every player onto the pitch before locking your squad.") + '</div>',
        '<div class="actions-row">',
        '<button class="primary-button" data-action="versus-ready" ' + (versus.myReady || !lineupReady ? "disabled" : "") + '>Lock Squad</button>',
        '</div>',
        '</div>',
        '</aside>'
      ].join("");
    }
    return renderDraftPanel(false);
  }

  function renderVersusSeriesPanel() {
    var versus = state.versus;
    var series = versus.series;
    if (!series) {
      return [
        '<aside class="panel draft-panel">',
        '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>Series Pending</h2><small>Waiting for both squads to lock in.</small></div></div></div>',
        '<div class="draft-body"><div class="empty-state">The host will run the Bo5 once both players are ready.</div></div>',
        '</aside>'
      ].join("");
    }
    var myTeam = snapshotTeam(state, state.teamName);
    var myIsA = series.teamA === myTeam.name;
    var myWins = myIsA ? series.winsA : series.winsB;
    var oppWins = myIsA ? series.winsB : series.winsA;
    var won = series.winnerName === myTeam.name;
    return [
      '<aside class="panel draft-panel versus-series-panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>Bo5 Series</h2><small>' + escapeHtml(series.teamA) + ' vs ' + escapeHtml(series.teamB) + '</small></div></div></div>',
      '<div class="draft-body">',
      '<div class="versus-scoreline">',
      metric("You", String(myWins), won ? "gold" : ""),
      metric("Opponent", String(oppWins), !won && versus.phase === "done" ? "red" : ""),
      metric("Result", versus.phase === "done" ? (won ? "Win" : "Loss") : "Live", won ? "gold" : "red"),
      '</div>',
      '<div class="section-label">Matches</div>',
      '<div class="versus-match-list">',
      series.matches.map(function (match) {
        var userHome = match.home === myTeam.name;
        var userWon = match.winnerName === myTeam.name;
        return '<div class="versus-match-row ' + (userWon ? "win" : "loss") + '"><strong>Game ' + match.n + '</strong><span>' + escapeHtml(match.home) + ' ' + escapeHtml(match.score) + ' ' + escapeHtml(match.away) + '</span><em>' + (userWon ? "W" : "L") + (userHome ? " · home" : " · away") + '</em></div>';
      }).join(""),
      '</div>',
      versus.phase === "cup" && !state.tournament ? '<div class="notice versus-cup-wait">Both squads are locked. Running the random World Cup draw now…</div>' : "",
      '</div>',
      '</aside>'
    ].join("");
  }

  function renderVersusBo5Summary() {
    var versus = state.versus;
    var series = versus.series;
    if (!series) return "";
    var myTeam = snapshotTeam(state, state.teamName);
    var myIsA = series.teamA === myTeam.name;
    var myWins = myIsA ? series.winsA : series.winsB;
    var oppWins = myIsA ? series.winsB : series.winsA;
    var wonBo5 = series.winnerName === myTeam.name;
    return [
      '<div class="versus-bo5-summary">',
      '<div class="section-label">Head-to-head Bo5</div>',
      '<div class="versus-scoreline">',
      metric("You", String(myWins), wonBo5 ? "gold" : ""),
      metric("Opponent", String(oppWins), !wonBo5 ? "red" : ""),
      metric("Bo5", wonBo5 ? "Win" : "Loss", wonBo5 ? "gold" : "red"),
      '</div>',
      '</div>'
    ].join("");
  }

  function renderVersusTournamentPanel() {
    var tournament = state.tournament;
    return [
      '<aside class="panel tournament-panel versus-tournament-panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>World Cup Draw</h2><small>Both XIs were randomly placed into the 16-team field</small></div></div></div>',
      '<div class="side-body tournament-panel-body">',
      renderVersusBo5Summary(),
      renderTournamentCupBody(tournament, {
        notice: "Live group tables and knockout bracket, same view as solo cup."
      }),
      '</div>',
      '</aside>'
    ].join("");
  }

  function renderVersusCupStandings(cupResult) {
    if (!cupResult || !cupResult.players || !cupResult.players.length) return "";
    var myCupId = myVersusCupTeamId();
    return [
      '<div class="section-label">Final standings · all 16 teams</div>',
      '<div class="notice">Champion: <strong>' + escapeHtml(cupResult.championName || "TBD") + '</strong></div>',
      '<div class="versus-standings versus-standings-full">',
      cupResult.players.map(function (row, index) {
        var isMe = row.teamId === myCupId;
        var isOpp = row.teamId === opponentVersusCupTeamId();
        return '<div class="versus-standing-row ' + (isMe ? "user-team" : "") + ' ' + (isOpp ? "opponent-team" : "") + ' ' + (row.champion ? "champion" : "") + '">',
        '<span class="versus-standing-rank">#' + (index + 1) + '</span>',
        '<div><strong>' + escapeHtml(row.name) + (isMe ? " (You)" : isOpp ? " (Opponent)" : "") + '</strong><span>' + escapeHtml(row.groupName) + ' #' + row.groupRank + ' · ' + escapeHtml(row.cupDetail) + '</span></div>',
        '<em>' + escapeHtml(row.cupLabel) + '</em>',
        '</div>';
      }).join(""),
      '</div>'
    ].join("");
  }

  function renderVersusResultsPanel() {
    var versus = state.versus;
    var cupResult = versus.cupResult;
    var tournament = state.tournament;
    return [
      '<aside class="panel tournament-panel versus-results-panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h2>Final Results</h2><small>Bo5, World Cup groups, bracket, and full standings</small></div></div></div>',
      '<div class="side-body tournament-panel-body">',
      renderVersusBo5Summary(),
      tournament ? renderTournamentCupBody(tournament, { notice: "Final group tables and knockout bracket." }) : "",
      renderVersusCupStandings(cupResult),
      '<div class="actions-row"><button class="primary-button" data-action="versus-rematch">Draft Rematch</button><button class="ghost-button" data-action="leave-versus">Leave Room</button></div>',
      '</div>',
      '</aside>'
    ].join("");
  }

  function renderVersusStatusPanel() {
    var versus = state.versus;
    return [
      '<section class="panel versus-status-panel">',
      '<div class="panel-header"><div class="panel-title"><span class="status-dot"></span><div><h3>1v1 Room</h3><small>' + escapeHtml(versus.roomId || "Not connected") + '</small></div></div>',
      '<button class="ghost-button" data-action="leave-versus">Leave</button>',
      '</div>',
      '<div class="versus-status-body">',
      '<div class="versus-status-grid">',
      metric("Connection", versus.connected ? "Live" : "Offline", versus.connected ? "green" : "red"),
      metric("You", state.teamName, "teal"),
      metric("Opponent", versus.opponentName || "Waiting", ""),
      metric("Progress", versus.opponentReady ? "Ready" : versus.opponentProgress + "/11", versus.opponentReady ? "green" : ""),
      '</div>',
      versus.opponentTeam && versus.opponentReady ? '<div class="notice">Opponent locked in at ' + versus.opponentTeam.rating.toFixed(1) + ' rating.</div>' : "",
      '</div>',
      '</section>'
    ].join("");
  }

  var VERSUS_ROOM_PREFIX = "xicup-";

  function generateVersusRoomCode() {
    return String(1000 + Math.floor(Math.random() * 9000));
  }

  function versusPeerIdFromCode(roomCode) {
    var digits = String(roomCode || "").replace(/\D/g, "");
    if (!digits) return "";
    return VERSUS_ROOM_PREFIX + digits.padStart(4, "0").slice(-4);
  }

  function normalizeVersusJoinInput(input) {
    var raw = String(input || "").trim();
    if (!raw) return { roomCode: "", peerId: "" };
    if (raw.indexOf("join=") !== -1) {
      try {
        raw = new URL(raw).searchParams.get("join") || raw;
      } catch (error) {
        var joinMatch = raw.match(/join=([^&]+)/);
        if (joinMatch) raw = decodeURIComponent(joinMatch[1]);
      }
    }
    raw = raw.trim();
    if (raw.indexOf(VERSUS_ROOM_PREFIX) === 0) {
      var suffix = raw.slice(VERSUS_ROOM_PREFIX.length);
      if (/^\d{1,4}$/.test(suffix)) {
        var padded = suffix.padStart(4, "0");
        return { roomCode: padded, peerId: versusPeerIdFromCode(padded) };
      }
      return { roomCode: raw, peerId: raw };
    }
    var digits = raw.replace(/\D/g, "");
    if (digits) {
      var code = digits.padStart(4, "0").slice(-4);
      return { roomCode: code, peerId: versusPeerIdFromCode(code) };
    }
    return { roomCode: raw, peerId: raw };
  }

  function isLocalFileGame() {
    return window.location.protocol === "file:";
  }

  function buildVersusInviteUrl(roomId) {
    if (isLocalFileGame()) return "";
    var url = new URL(window.location.href);
    url.searchParams.set("join", roomId);
    return url.toString();
  }

  function versusShareText(roomId) {
    if (!roomId) return "";
    if (isLocalFileGame()) {
      return "Join my XI Cup 1v1 room.\n1. Open the game in your browser (same copy or hosted link).\n2. Go to 1v1 → Join With Code.\n3. Enter room code: " + roomId;
    }
    return buildVersusInviteUrl(roomId);
  }

  function maybeJoinVersusFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var joinId = params.get("join");
    if (!joinId) return;
    state.activeTab = "versus";
    joinVersusRoom(joinId);
  }

  function createVersusRoom() {
    if (typeof Peer === "undefined") {
      state.versus = defaultVersusState();
      state.versus.error = "PeerJS did not load. Check your internet connection and reload.";
      state.activeTab = "versus";
      render();
      return;
    }
    cleanupPeer();
    var roomCode = generateVersusRoomCode();
    var peerId = versusPeerIdFromCode(roomCode);
    state.versus = defaultVersusState();
    state.versus.role = "host";
    state.versus.roomId = roomCode;
    state.activeTab = "versus";
    peer = new Peer(peerId, { debug: 1 });
    peer.on("open", function () {
      state.versus.error = "";
      saveState();
      render();
    });
    peer.on("connection", function (connection) {
      setupPeerConnection(connection);
    });
    peer.on("error", function (error) {
      if (error.type === "unavailable-id") {
        createVersusRoom();
        return;
      }
      state.versus.error = error.message || "Could not create room.";
      saveState();
      render();
    });
    saveState();
    render();
  }

  function joinVersusRoom(roomId) {
    if (typeof Peer === "undefined") {
      state.versus = defaultVersusState();
      state.versus.error = "PeerJS did not load. Check your internet connection and reload.";
      state.activeTab = "versus";
      render();
      return;
    }
    cleanupPeer();
    var resolved = normalizeVersusJoinInput(roomId);
    if (!resolved.peerId) return;
    state.versus = defaultVersusState();
    state.versus.role = "guest";
    state.versus.roomId = resolved.roomCode;
    state.activeTab = "versus";
    peer = new Peer({ debug: 1 });
    peer.on("open", function () {
      var connection = peer.connect(resolved.peerId, { reliable: true });
      setupPeerConnection(connection);
    });
    peer.on("error", function (error) {
      state.versus.error = error.message || "Could not join room.";
      saveState();
      render();
    });
    saveState();
    render();
  }

  function setupPeerConnection(connection) {
    if (!connection) return;
    if (peerConn && peerConn.open) peerConn.close();
    peerConn = connection;
    connection.on("open", function () {
      state.versus.connected = true;
      state.versus.error = "";
      beginVersusDraft();
      sendVersusMessage({
        type: "hello",
        name: state.teamName,
        progress: pickedCount(state),
        ready: false
      });
      saveState();
      render();
    });
    connection.on("data", handleVersusMessage);
    connection.on("close", function () {
      state.versus.connected = false;
      state.versus.error = "Connection closed.";
      saveState();
      render();
    });
    connection.on("error", function () {
      state.versus.error = "Connection error.";
      saveState();
      render();
    });
  }

  function sendVersusMessage(payload) {
    if (!peerConn || !peerConn.open) return;
    try {
      peerConn.send(payload);
    } catch (error) {
      console.warn("Could not send versus message", error);
    }
  }

  function handleVersusMessage(payload) {
    if (!payload || !payload.type || !state.versus) return;
    if (payload.type === "hello" || payload.type === "status") {
      state.versus.opponentName = payload.name || state.versus.opponentName || "Opponent";
      state.versus.opponentProgress = payload.progress || 0;
      state.versus.opponentReady = Boolean(payload.ready);
      saveState();
      render();
      return;
    }
    if (payload.type === "ready") {
      state.versus.opponentName = payload.team && payload.team.name ? payload.team.name : state.versus.opponentName;
      state.versus.opponentTeam = payload.team || null;
      state.versus.opponentReady = true;
      state.versus.opponentProgress = 11;
      checkVersusSeriesStart();
      saveState();
      render();
      return;
    }
    if (payload.type === "series") {
      state.versus.series = payload.series || null;
      state.versus.phase = "series";
      saveState();
      render();
      return;
    }
    if (payload.type === "cup-start") {
      if (payload.draw) applyVersusCupDraw(payload.draw);
      saveState();
      render();
      return;
    }
    if (payload.type === "cup") {
      state.versus.cupResult = payload.cupResult || state.versus.cupResult || null;
      state.versus.phase = "done";
      stopTournamentLive();
      saveState();
      render();
      return;
    }
    if (payload.type === "rematch") {
      beginVersusDraft();
      sendVersusMessage({
        type: "hello",
        name: state.teamName,
        progress: pickedCount(state),
        ready: false
      });
      saveState();
      render();
    }
  }

  function beginVersusDraft() {
    var savedTeams = state.savedTeams || [];
    var bots = state.bots && state.bots.length ? state.bots : generateBotPool();
    var versus = state.versus || defaultVersusState();
    stopTournamentLive();
    state = newDraftState();
    state.activeTab = "versus";
    state.savedTeams = savedTeams;
    state.bots = bots;
    state.versus = versus;
    state.versus.phase = "draft";
    state.versus.myReady = false;
    state.versus.opponentReady = false;
    state.versus.opponentTeam = null;
    state.versus.series = null;
    state.versus.cupResult = null;
    state.tournament = null;
    selectedSource = null;
    saveState();
  }

  function broadcastVersusStatus() {
    if (!state.versus || !state.versus.connected || !peerConn || !peerConn.open) return;
    sendVersusMessage({
      type: "status",
      name: state.teamName,
      progress: pickedCount(state),
      ready: state.versus.myReady
    });
  }

  function markVersusReady() {
    if (!isFieldComplete(state) || !state.versus || state.versus.myReady) return;
    state.versus.myReady = true;
    sendVersusMessage({
      type: "ready",
      team: snapshotTeam(state, state.teamName)
    });
    broadcastVersusStatus();
    checkVersusSeriesStart();
    saveState();
    render();
  }

  function myVersusCupTeamId() {
    return state.versus && state.versus.role === "host" ? "player-a" : "player-b";
  }

  function opponentVersusCupTeamId() {
    return myVersusCupTeamId() === "player-a" ? "player-b" : "player-a";
  }

  function pickSeededTournamentBots(count, rng) {
    if (!state.bots || state.bots.length < count) state.bots = generateBotPool();
    state.bots = ensureBotTeamNames(state.bots);
    var sorted = state.bots.slice().sort(function (a, b) {
      return String(a.id).localeCompare(String(b.id));
    });
    return seededSample(sorted, count, rng);
  }

  function versusCupSeedKey(teamA, teamB, suffix) {
    return hashString(String(state.versus.roomId) + "|" + suffix + "|" + teamA.name + "|" + teamB.name);
  }

  function serializeTournamentTeam(team) {
    return {
      id: team.id,
      tournamentId: team.tournamentId,
      name: team.name,
      owner: team.owner,
      formation: team.formation,
      manager: team.manager,
      rating: team.rating,
      experience: team.experience || 0,
      record: team.record || { w: 0, l: 0 },
      players: team.players || [],
      bonuses: team.bonuses || [],
      user: Boolean(team.user),
      isOpponent: Boolean(team.isOpponent)
    };
  }

  function serializeVersusCupDraw(tournament) {
    return {
      seed: tournament._cupSeed,
      id: tournament.id,
      stage: tournament.stage,
      played: tournament.played,
      totalMatches: tournament.totalMatches,
      teams: tournament.teams.map(serializeTournamentTeam),
      groups: tournament.groups,
      groupMatches: tournament.groupMatches,
      bracketRounds: tournament.bracketRounds,
      activeRoundIndex: tournament.activeRoundIndex,
      championId: tournament.championId,
      championName: tournament.championName,
      log: tournament.log || []
    };
  }

  function buildVersusWorldCupTournament(teamA, teamB) {
    var drawSeed = versusCupSeedKey(teamA, teamB, "draw");
    var matchSeed = versusCupSeedKey(teamA, teamB, "matches");
    var drawRng = makeSeededRng(drawSeed);
    var playerA = cloneTournamentTeam(teamA, false);
    playerA.tournamentId = "player-a";
    playerA.name = teamA.name;
    var playerB = cloneTournamentTeam(teamB, false);
    playerB.tournamentId = "player-b";
    playerB.name = teamB.name;
    var botTeams = pickSeededTournamentBots(14, drawRng).map(function (bot, index) {
      var entry = cloneTournamentTeam(bot, false);
      entry.tournamentId = "bot-" + (index + 1);
      return entry;
    });
    var ordered = seededSample([playerA, playerB].concat(botTeams), 16, drawRng);
    var tournament = createTournamentFromTeams(ordered, {
      title: "World Cup draw",
      detail: teamA.name + " and " + teamB.name + " were randomly placed into the groups."
    });
    tournament._cupSeed = matchSeed;
    tournament._rng = makeSeededRng(matchSeed);
    tournament.versusCup = true;
    return tournament;
  }

  function applyVersusCupDraw(payload) {
    if (!payload) return;
    stopTournamentLive();
    var tournament = {
      id: payload.id,
      stage: payload.stage || "groups",
      played: payload.played || 0,
      totalMatches: payload.totalMatches || 31,
      teams: payload.teams || [],
      groups: payload.groups || [],
      groupMatches: payload.groupMatches || [],
      bracketRounds: payload.bracketRounds || buildEmptyBracket(),
      activeRoundIndex: payload.activeRoundIndex || 0,
      championId: payload.championId || null,
      championName: payload.championName || "",
      log: payload.log || []
    };
    tournament._cupSeed = payload.seed;
    tournament._rng = makeSeededRng(payload.seed);
    tournament.viewerTeamId = myVersusCupTeamId();
    tournament.opponentTeamId = opponentVersusCupTeamId();
    tournament.versusCup = true;
    markVersusTournamentTeams(tournament);
    state.tournament = tournament;
    state.versus.phase = "cup";
    saveState();
    scheduleTournamentStep();
    render();
  }

  function markVersusTournamentTeams(tournament) {
    var viewerId = tournament.viewerTeamId;
    var opponentId = tournament.opponentTeamId;
    tournament.teams.forEach(function (team) {
      team.user = team.tournamentId === viewerId;
      team.isOpponent = team.tournamentId === opponentId;
    });
    return tournament;
  }

  function finishVersusWorldCup() {
    if (!state.tournament || !state.versus || state.versus.phase !== "cup") return;
    stopTournamentLive();
    if (state.tournament._rng) delete state.tournament._rng;
    var cupResult = buildVersusCupResult(state.tournament);
    state.versus.cupResult = cupResult;
    state.versus.phase = "done";
    if (state.versus.role === "host") {
      sendVersusMessage({ type: "cup", cupResult: cupResultForPeer(cupResult) });
    }
    saveState();
    render();
  }

  function getTeamCupFinish(tournament, teamId) {
    var group = tournament.groups.find(function (item) { return item.teamIds.indexOf(teamId) !== -1; });
    var table = group ? groupTable(tournament, group) : [];
    var groupRank = table.findIndex(function (row) { return row.team.tournamentId === teamId; }) + 1;
    var groupName = group ? group.name : "-";
    if (tournament.championId === teamId) {
      return { label: "Champion", detail: "Won the final", groupName: groupName, groupRank: groupRank, score: 100, tone: "gold" };
    }
    var exitRound = "";
    tournament.bracketRounds.forEach(function (round) {
      round.matches.forEach(function (match) {
        if (!match.played) return;
        if (match.homeId !== teamId && match.awayId !== teamId) return;
        if (match.winnerId !== teamId) exitRound = round.name;
      });
    });
    if (exitRound === "Final") {
      return { label: "Runner-up", detail: "Lost in the final", groupName: groupName, groupRank: groupRank, score: 80, tone: "gold" };
    }
    if (exitRound === "Semifinals") {
      return { label: "Semifinals", detail: "Eliminated in semifinals", groupName: groupName, groupRank: groupRank, score: 60, tone: "" };
    }
    if (exitRound === "Quarterfinals") {
      return { label: "Quarterfinals", detail: "Eliminated in quarterfinals", groupName: groupName, groupRank: groupRank, score: 40, tone: "" };
    }
    if (groupRank > 0 && groupRank <= 2) {
      return { label: "Missed knockout", detail: groupName + " #" + groupRank + " but did not advance", groupName: groupName, groupRank: groupRank, score: 20, tone: "" };
    }
    return {
      label: "Group exit",
      detail: groupName + " finished #" + (groupRank || 4),
      groupName: groupName,
      groupRank: groupRank || 4,
      score: groupRank === 3 ? 10 : 0,
      tone: "red"
    };
  }

  function buildVersusCupResult(tournament) {
    var playerRows = tournament.teams.map(function (team) {
      var finish = getTeamCupFinish(tournament, team.tournamentId);
      return {
        teamId: team.tournamentId,
        name: team.name,
        rating: team.rating,
        groupName: finish.groupName,
        groupRank: finish.groupRank,
        cupLabel: finish.label,
        cupDetail: finish.detail,
        cupScore: finish.score,
        tone: finish.tone,
        champion: tournament.championId === team.tournamentId,
        isViewer: team.tournamentId === tournament.viewerTeamId,
        isOpponent: team.tournamentId === tournament.opponentTeamId
      };
    });
    playerRows.sort(function (a, b) { return b.cupScore - a.cupScore || b.rating - a.rating || a.name.localeCompare(b.name); });
    return {
      championId: tournament.championId,
      championName: tournament.championName,
      players: playerRows,
      tournament: tournament
    };
  }

  function checkVersusSeriesStart() {
    if (!state.versus || !state.versus.myReady || !state.versus.opponentReady || !state.versus.opponentTeam) return;
    if (state.versus.series || state.versus.phase === "cup" || state.versus.phase === "done") return;
    var myTeam = snapshotTeam(state, state.teamName);
    if (state.versus.role === "host") {
      var series = runBo5Series(myTeam, state.versus.opponentTeam);
      var tournament = buildVersusWorldCupTournament(myTeam, state.versus.opponentTeam);
      var drawPayload = serializeVersusCupDraw(tournament);
      state.versus.series = series;
      state.versus.phase = "series";
      sendVersusMessage({ type: "series", series: series });
      sendVersusMessage({ type: "cup-start", draw: drawPayload });
      applyVersusCupDraw(drawPayload);
    } else {
      state.versus.phase = "series";
    }
    saveState();
    render();
  }

  function runBo5Series(teamA, teamB) {
    var seed = versusCupSeedKey(teamA, teamB, "bo5");
    var rng = makeSeededRng(seed);
    var matches = [];
    var winsA = 0;
    var winsB = 0;
    var homeA = true;
    var matchNum = 0;
    while (winsA < 3 && winsB < 3 && matchNum < 5) {
      var home = homeA ? teamA : teamB;
      var away = homeA ? teamB : teamA;
      var odds = winProbability(home.rating, away.rating);
      var homeWon = rng() < odds;
      var score = tournamentScoreline(homeWon, odds);
      if (homeWon) {
        if (homeA) winsA += 1;
        else winsB += 1;
      } else if (homeA) {
        winsB += 1;
      } else {
        winsA += 1;
      }
      matches.push({
        n: matchNum + 1,
        home: home.name,
        away: away.name,
        score: score,
        winnerName: homeWon ? home.name : away.name,
        odds: Math.round(odds * 100)
      });
      homeA = !homeA;
      matchNum += 1;
    }
    return {
      matches: matches,
      winsA: winsA,
      winsB: winsB,
      teamA: teamA.name,
      teamB: teamB.name,
      winnerName: winsA > winsB ? teamA.name : teamB.name
    };
  }

  function hashString(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function makeSeededRng(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function copyVersusInviteLink() {
    var shareText = versusShareText(state.versus.roomId);
    if (!shareText) return;
    var copiedLabel = isLocalFileGame() ? "Invite instructions copied." : "Invite link copied.";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(function () {
        window.alert(copiedLabel);
      }).catch(function () {
        window.prompt("Copy and send this to your friend", shareText);
      });
      return;
    }
    window.prompt("Copy and send this to your friend", shareText);
  }

  function promptJoinVersusRoom() {
    var code = window.prompt("Enter your friend's 4-digit room code", "");
    if (!code) return;
    joinVersusRoom(code);
  }

  function leaveVersusRoom() {
    cleanupPeer();
    state.versus = defaultVersusState();
    state.activeTab = "versus";
    saveState();
    render();
  }

  function requestVersusRematch() {
    if (!state.versus.connected) return;
    sendVersusMessage({ type: "rematch" });
    beginVersusDraft();
    sendVersusMessage({
      type: "hello",
      name: state.teamName,
      progress: pickedCount(state),
      ready: false
    });
    saveState();
    render();
  }

  function cleanupPeer() {
    if (peerConn) {
      try {
        peerConn.close();
      } catch (error) {
        console.warn("Could not close peer connection", error);
      }
      peerConn = null;
    }
    if (peer) {
      try {
        peer.destroy();
      } catch (error) {
        console.warn("Could not destroy peer", error);
      }
      peer = null;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }
})();
