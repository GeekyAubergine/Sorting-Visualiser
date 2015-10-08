//Labels
LABEL_CONTROLS_HEADING = 'Controls';
LABEL_CONTROLS_STOP = 'Stop';
LABEL_CONTROLS_NEW_ARRAY = 'New Array';
LABEL_SETTINGS_HEADING = 'Settings';
LABEL_SETTINGS_ARRAY_SIZE = 'Array Size';
LABEL_SETTINGS_TIME_STEP = 'Time Step';
LABEL_SETTINGS_ARRAY_TYPE = 'Array Type';
LABEL_SETTINGS_SOUND = 'Sound';

//Class names
CONTAINER_CLASS = 'sv-container';
LIST_CLASS = 'sv-list';
LEGEND_ITEM_CLASS = 'sv-legend-item';

//Container ID's
MAIN_CONTAINER_ID = 'sorting-visualiser-container';
GRAPH_AND_INFOMATION_CONTAINER_ID = 'sv-grap-and-information-container';
GRAPH_CONTAINER_ID = 'sv-graph-container';
CONTROLS_CONTAINER_ID = 'sv-controls-container';
INFOMATION_CONTAINER_ID = 'sv-infomation-container';

//Graph Element ID's
GRAPH_ID = 'sv-graph';
GRAPH_GRAPHICS_ID = 'sv-graph-graphics-element';

//Controls Element ID's
STOP_BUTTON_ID = 'sv-stop-button';
ALGORITHMS_CONTROLS_CONTAINER_ID = 'sv-controls';
ALGORITHMS_SETTINGS_CONTAINER_ID = 'sv-settings';
ALGORITHMS_CONTAINER_ID = 'sv-algorithms';

//Information Element ID's
STATS_ID = 'sv-stats';
LEGEND_ID = 'sv-legend';
STATS_COMPARISONS_ID = 'sv-comparisons-stat';
STATS_SWAPS_ID = 'sv-swaps-stat';
STAT_CLASS = 'sv-stat';
INFORMATION_LEFT_CONTAINER_ID = 'sv-information-left-container';
INFORMATION_RIGHT_CONTAINER_ID = 'sv-information-right-container';
ALGORITHM_INFORMATION_PROPERTIES_ID = 'sv-algorithm-information-properties-container';
ALGORITHM_INFORMATION_ALGORITHM_ID = 'sv-algorithm-information-algorithm-container';
ALGORITHM_INFORMATION_DESCRIPTION_ID = 'sv-algorithm-information-description-container';
INFORMATION_NAME_ID = 'sv-algorithm-name';
INFORMATION_BEST_CASE_COMPLEXITY_ID = 'sv-algorithm-best-complexity';
INFORMATION_AVERAGE_CASE_COMPLEXITY_ID = 'sv-algorithm-average-complexity';
INFORMATION_WORST_CASE_COMPLEXITY_ID = 'sv-algorithm-worst-complexity';
INFORMATION_MEMORY_ID = 'sv-algorithm-memory';
INFORMATION_STABLE_ID = 'sv-algorithm-stable';
INFORMATION_TECHNIQUE_ID = 'sv-algorithm-technique';
INFORMATION_ALGORITHM_ID = 'sv-algorithm-algorithm';
INFORMATION_DESCRIPTION_ID = 'sv-algorithm-description';

//Bar class names
BAR_NORMAL_CLASS = 'sv-bar-normal';
BAR_ACTIVE_CLASS = 'sv-bar-active'; //Current bar indexed
BAR_COMPARISON_CLASS = 'sv-bar-comparison';
BAR_BOUND_CLASS = 'sv-bar-bound';

//Button class names
BUTTON_CLASS = 'sv-button'
BUTTON_SELECTED_CLASS = 'sv-selected';

//Control class names
CONTROL_CONTAINER_CLASS = 'sv-control';
CONTROL_LABEL_CLASS = 'sv-control-label';

//Controls
CONTROL_ARRAY_SIZE_LABEL = "Array Size";
CONTROL_ARRAY_SIZE_STEP = 5;
CONTROL_LOOP_TIME_LABEL = "Time Step";
CONTROL_LOOP_TIME_MIN = 0.01;
CONTROL_LOOP_TIME_STEP = 0.01;
CONTROL_ARRAY_TYPE_LABEL = 'Array Type';
CONTROL_SOUND_TOGGLE_LABEL = 'Sound';
CONTROL_STOP_BUTTON_CLASS = 'sv-control sv-button sv-control-button';

//Logging should be turned on if verbose output is wanted
LOGGING_ACTIVE = true;

ARRAY_MIN_SIZE = 5;
MAX_VALUE = 100;
GRAPH_HEIGHT_TO_WIDTH_RATIO = 0.3;

//Graph margins
margin = {
  top: 0,
  right: 14,
  bottom: 10,
  left: 6
};

//Buttons
var sortingAlgorithmButtons = [{
  name: 'Bubble',
  callBack: bubbleSort,
  bestCase: 'O(n)',
  averageCase: 'O(n^2)',
  worstCase: 'O(n^2)',
  memory: 'O(1)',
  stable: true,
  technique: 'Exchanging',
  algorithm: 'ToDo',
  description: 'ToDo'
}]

var graphDimensions = {
  width: 0,
  height: 0
}
var axis = {
  x: null,
  y: null
};
var axisGraphicsElements = {
  x: null,
  y: null
};
var graphScale = {
  x: null,
  y: null
};

//Sorting variables
var numberOfElementsToSort = 20;
var arrayToSort = [];
var sortingStepDelay = 50;
var sortingCurrentIndex;
var sortingComparisonIndex;
var sortingLeftBound;
var sortingRightBound;
var sortingStats = {
  numberOfComparisons: 0,
  numberOfSwaps: 0
}
var sortingAlgorithmCurrentlyRunning = false;
var sortingAlgorithmLoop;
var arrayGenerationAlgorithm = generateRandomData;
var audioContext;
var audioOscillator;
var soundOn = true;

/* ------------------------------------------------------------------------- */
/* Utility Methods
/* ------------------------------------------------------------------------- */

/**
 * Prints given string to console.log if LOGGING_ACTIVE is true
 */
function info(stringToLog) {
  if (stringToLog == undefined || stringToLog == null) {
    return;
  }
  if (LOGGING_ACTIVE) {
    console.log(stringToLog);
  }
}

/**
 * Sets information for algorithm and start algorithm
 * @param {Object} algorithm object
 */
function startSortingAlgorithm(algorithm) {
  if (algorithm == undefined || algorithm == null) {
    return;
  }
  sortingAlgorithmCurrentlyRunning = true;
  sortingStats.numberOfComparisons = 0;
  sortingStats.numberOfSwaps = 0;
  updateAlgorithmInformation(algorithm);
  algorithm.callBack();
  startSound();
}

/**
 * Stops the current sorting algorithm
 */
function stopSortingAlgorithm() {
  info('Sorting algorithm stopped');
  sortingAlgorithmCurrentlyRunning = false;

  //Loops as it sometimes fails
  for (var i = 0; i < 10; i++) {
    setTimeout(function() {
      clearTimeout(sortingAlgorithmLoop);
    }, 0);
    setTimeout(function() {
      clearInterval(sortingAlgorithmLoop);
    }, 0);
  }

  //Removes selected class from all buttons
  d3.selectAll('.' + BUTTON_CLASS).classed(BUTTON_SELECTED_CLASS, false);

  //Resets the sorting algorithm index markers to -1
  sortingCurrentIndex = -1;
  sortingComparisonIndex = -1;
  sortingLeftBound = -1;
  sortingRightBound = -1;
  updateScreen();

  setTimeout(stopSound, sortingStepDelay * 2);
}

/* ------------------------------------------------------------------------- */
/* Main containers
/* ------------------------------------------------------------------------- */

/**
 * Returns whether or not the parent container exsists
 * @return {boolean} Whether the parent container exsists
 */
function mainContainerExsists() {
  return $('#' + MAIN_CONTAINER_ID).length > 0;
}

/**
 * Creates the graph and information container. This is the main left container
 */
function createGraphAndInformationContainer() {
  getMainContainer().append('div').attr('id', GRAPH_AND_INFOMATION_CONTAINER_ID).attr('class', CONTAINER_CLASS);
}

/**
 * Creates the graph container
 */
function createGraphContainer() {
  getGraphAndInformationContainer().append('div').attr('id', GRAPH_CONTAINER_ID).attr('class', CONTAINER_CLASS);
}

/**
 * Creates the controls container. This is the main right container
 */
function createControlsContainer() {
  getMainContainer().append('div').attr('id', CONTROLS_CONTAINER_ID).attr('class', CONTAINER_CLASS);
}

/**
 * Creates the information container
 */
function createInfomationContainer() {
  getGraphAndInformationContainer().append('div').attr('id', INFOMATION_CONTAINER_ID).attr('class', CONTAINER_CLASS);
}

/**
 * Creates the information left container
 */
function createInformationLeftContainer() {
  getInformationContainer().append('div').attr('id', INFORMATION_LEFT_CONTAINER_ID).attr('class', CONTAINER_CLASS);
}

/**
 * Creates the information right container
 */
function createInformationRightContainer() {
  getInformationContainer().append('div').attr('id', INFORMATION_RIGHT_CONTAINER_ID).attr('class', CONTAINER_CLASS);
}

/**
 * Creates all containers used in Sorter-Visualiser
 */
function createContainers() {
  createGraphAndInformationContainer();
  createGraphContainer();
  createControlsContainer();
  createInfomationContainer();
  createInformationLeftContainer();
  createInformationRightContainer();
}

/**
 * Returns the main container for the whole program
 * @return {d3.element} Main container
 */
function getMainContainer() {
  return d3.select('#' + MAIN_CONTAINER_ID);
}

/**
 * Returns the main container for the whole program
 * @return {d3.element} Main container
 */
function getGraphAndInformationContainer() {
  return d3.select('#' + GRAPH_AND_INFOMATION_CONTAINER_ID);
}

/**
 * Returns the graph container for the whole program
 * @return {d3.element} Graph container
 */
function getGraphContainer() {
  return d3.select('#' + GRAPH_CONTAINER_ID);
}

/**
 * Returns the controls container for the whole program
 * @return {d3.element} Controls container
 */
function getContolsContainer() {
  return d3.select('#' + CONTROLS_CONTAINER_ID);
}

/**
 * Returns the information container for the whole program
 * @return {d3.element} Information container
 */
function getInformationContainer() {
  return d3.select('#' + INFOMATION_CONTAINER_ID);
}

/**
 * Returns the information left container for the whole program
 * @return {d3.element} Informatio left container
 */
function getInformationLeftContainer() {
  return d3.select('#' + INFORMATION_LEFT_CONTAINER_ID);
}

/**
 * Returns the information right container for the whole program
 * @return {d3.element} Information right container
 */
function getInformationRightContainer() {
  return d3.select('#' + INFORMATION_RIGHT_CONTAINER_ID);
}

/* ------------------------------------------------------------------------- */
/* Graph Creation and Control
/* ------------------------------------------------------------------------- */

/**
 * Creates graph and associated DOM elements
 */
function createGraph() {
  var graphContainer = getGraphContainer();
  var graph = graphContainer.append('svg').attr('id', GRAPH_ID);
  graph.append('g').attr('id', GRAPH_GRAPHICS_ID);

  axisGraphicsElements.x = graph.append('g').attr('class', 'x sv-axis');
  axisGraphicsElements.y = graph.append('g').attr('class', 'y sv-axis');
}

/**
 * Updates the dimensions of the graph and updates graphics
 */
function updateGraphDimensions() {
  //Get graphics objects
  var graphContainer = getGraphContainer();
  var graph = d3.select('#' + GRAPH_ID);

  var graphContainerWidth = parseInt(graphContainer.style('width'));
  var graphContainerHeight = graphContainerWidth * GRAPH_HEIGHT_TO_WIDTH_RATIO;
  $("#" + GRAPH_CONTAINER_ID).css("height", graphContainerHeight);

  var width = graphDimensions.width = graphContainerWidth - margin.left - margin.right;
  var height = graphDimensions.height = graphContainerHeight - margin.top - margin.bottom;

  //Set scales
  graphScale.x = d3.scale.linear().range([0, width]);
  graphScale.y = d3.scale.linear().range([height - margin.top, 0]);

  //Set axis
  axis.x = d3.svg.axis().scale(graphScale.x).orient('bottom').ticks('none');
  axis.y = d3.svg.axis().scale(graphScale.y).orient('left').ticks('none');

  //Set graph sizes
  graph.attr('width', graphContainerWidth);
  graph.attr('height', graphContainerHeight);

  //Translate graph from
  //Select graph 'g'
  d3.select('#' + GRAPH_GRAPHICS_ID).attr('transform',
    'translate(' + margin.left + ', ' + margin.top + ')');

  axisGraphicsElements.x
    .attr("width", graphDimensions.width)
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(axis.x);
  axisGraphicsElements.y
    .attr("height", graphDimensions.height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(axis.y);
}

/* ------------------------------------------------------------------------- */
/* Controls Creation and Control
/* ------------------------------------------------------------------------- */
function createButton(parent, text, callBack) {
  var button = parent.append('li').attr('class', BUTTON_CLASS);
  button.text(text);
  button.on('click', function() {
    callBack()
  });
}

function createAlgorithmButton(parent, buttonData) {
  var button = parent.append('li').attr('class', BUTTON_CLASS);
  button.text(buttonData.name);
  button.on('click', function() {
    if (!sortingAlgorithmCurrentlyRunning) {
      button.classed(BUTTON_SELECTED_CLASS, true);
      startSortingAlgorithm(buttonData);
    }
  });
}

function createSortingAlgorithmButtons(container) {
  var container = container.append('div').attr('id', ALGORITHMS_CONTAINER_ID).attr('class', LIST_CLASS);
  container.append('h2').text('Algorithms');
  for (var i = 0; i < sortingAlgorithmButtons.length; i++) {
    createAlgorithmButton(container, sortingAlgorithmButtons[i]);
  }
}

function createControlButtons(container) {
  var container = container.append('div').attr('id', ALGORITHMS_CONTROLS_CONTAINER_ID).attr('class', LIST_CLASS);
  container.append('h2').text(LABEL_CONTROLS_HEADING);
  createButton(container, LABEL_CONTROLS_STOP, stopSortingAlgorithm);
  createButton(container, LABEL_CONTROLS_NEW_ARRAY, generateData);
}

function createAlgorithmControls(container) {
  var controlsContainer = container.append('div').attr('id', ALGORITHMS_SETTINGS_CONTAINER_ID).attr('class', LIST_CLASS);

  controlsContainer.append('h2').text(LABEL_SETTINGS_HEADING);
  var list = controlsContainer.append('ul');

  var arraySizeControlContainer = list.append('li').attr('class', CONTROL_CONTAINER_CLASS);
  arraySizeControlContainer.append('div').attr('class', CONTROL_LABEL_CLASS)
    .append('p').text(LABEL_SETTINGS_ARRAY_SIZE);
  var arraySizeControl = arraySizeControlContainer.append('input')
    .attr('type', 'number')
    .attr('min', ARRAY_MIN_SIZE)
    .attr('step', CONTROL_ARRAY_SIZE_STEP)
    .attr('value', numberOfElementsToSort);

  arraySizeControl.on('input', function() {
    if (!sortingAlgorithmCurrentlyRunning) {
      numberOfElementsToSort = this.value;
      generateData();
      updateScreen();
    } else {
      this.value = numberOfElementsToSort;
    }
  });

  var timeStepControlContainer = list.append('li').attr('class', CONTROL_CONTAINER_CLASS);
  timeStepControlContainer.append('div').attr('class', CONTROL_LABEL_CLASS)
    .append('p').text(LABEL_SETTINGS_TIME_STEP);
  var timeSetControl = timeStepControlContainer.append('input')
    .attr('type', 'number')
    .attr('min', CONTROL_LOOP_TIME_MIN)
    .attr('step', CONTROL_LOOP_TIME_STEP)
    .attr('value', sortingStepDelay / 1000);

  timeSetControl.on('input', function() {
    sortingStepDelay = Math.max(this.value * 1000, CONTROL_LOOP_TIME_MIN);
  });

  var arrayTypeControlContainer = list.append('li').attr('class', CONTROL_CONTAINER_CLASS);
  arrayTypeControlContainer.append('div').attr('class', CONTROL_LABEL_CLASS)
    .append('p').text(LABEL_SETTINGS_ARRAY_TYPE);
  var select = arrayTypeControlContainer.append('select');
  select.append('option').attr('value', 'best').text('Best');
  select.append('option').attr('value', 'random').attr('selected', 'selected').text('Random');
  select.append('option').attr('value', 'worst').text('Worst');

  select.on('change', function() {
      info('Array type selected: ' + this.value);
      if (this.value == 'best') {
        arrayGenerationAlgorithm = generateBestCase;
      }
      else if (this.value == 'worst') {
        arrayGenerationAlgorithm = generateWorstCase;
      } else {
        arrayGenerationAlgorithm = generateRandomData;
      }
      generateData();
  });

  var soundControlContainer = list.append('li').attr('class', CONTROL_CONTAINER_CLASS);
  soundControlContainer.append('div').attr('class', CONTROL_LABEL_CLASS)
    .append('p').text(LABEL_SETTINGS_SOUND);
  var select = soundControlContainer.append('select');
  select.append('option').attr('value', 'on').attr('selected', 'selected').text('On');
  select.append('option').attr('value', 'off').text('Off');

  select.on('change', function() {
      info('Array type selected: ' + this.value);
      if (this.value == 'off') {
        info('Sound turned off');
        stopSound();
        soundOn = false;
      }
      else {
        info('Sound turned on');
        soundOn = true;
        startSound();
      }
      generateData();
  });
}

function createControls() {
  var container = getContolsContainer();
  createControlButtons(container);
  createAlgorithmControls(container);
  createSortingAlgorithmButtons(container);
}

/* ------------------------------------------------------------------------- */
/* Infomation Creating and Control
/* ------------------------------------------------------------------------- */

function createLegend(container) {
  var legendContainer = container
    .append('div').attr('id', LEGEND_ID).attr('class', LIST_CLASS);
  legendContainer.append('h2').text('Legend');

  var list = legendContainer.append('ul');

  var item = list.append('li');
  item.append('div').attr('class', LEGEND_ITEM_CLASS + ' ' + BAR_ACTIVE_CLASS);
  item.append('p').text('= Current');

  item = list.append('li');
  item.append('div').attr('class', LEGEND_ITEM_CLASS + ' ' + BAR_COMPARISON_CLASS);
  item.append('p').text('= Comparison');

  item = list.append('li');
  item.append('div').attr('class', LEGEND_ITEM_CLASS + ' ' + BAR_BOUND_CLASS);
  item.append('p').text('= Bound');
}

function createStats(container) {
  var statsContainer = container.append('div').attr('id', STATS_ID).attr('class', LIST_CLASS);
  statsContainer.append('h2').text('Stats');
  var list = statsContainer.append('ul');
  list.append('li').attr('id', STATS_COMPARISONS_ID).attr('class', STAT_CLASS);
  list.append('li').attr('id', STATS_SWAPS_ID).attr('class', STAT_CLASS);
}

function createAlgorithmProperties(container) {
  var propertiesContainer = container.append('div').attr('id', ALGORITHM_INFORMATION_PROPERTIES_ID).attr('class', LIST_CLASS);
  propertiesContainer.append('h2').text('Properties');
  var list = propertiesContainer.append('ul');
  list.append('li').attr('id', INFORMATION_NAME_ID).text('Name: ');
  list.append('li').attr('id', INFORMATION_BEST_CASE_COMPLEXITY_ID).text('Best case: ');
  list.append('li').attr('id', INFORMATION_AVERAGE_CASE_COMPLEXITY_ID).text('Average case: ');
  list.append('li').attr('id', INFORMATION_WORST_CASE_COMPLEXITY_ID).text('Worst case: ');
  list.append('li').attr('id', INFORMATION_MEMORY_ID).text('Memory Usage: ');
  list.append('li').attr('id', INFORMATION_STABLE_ID).text('Stable: ');
  list.append('li').attr('id', INFORMATION_TECHNIQUE_ID).text('Technique: ');
}

function createAlgorithmInformation(container) {
  var algorithmContainer = container.append('div').attr('id', ALGORITHM_INFORMATION_ALGORITHM_ID).attr('class', LIST_CLASS);
  algorithmContainer.append('h2').text('Algorithm');
  var list = algorithmContainer.append('ul');
  list.append('li').attr('id', INFORMATION_DESCRIPTION_ID);
}

function createAlgorithmDescription(container) {
  var descriptionContainer = container.append('div').attr('id', ALGORITHM_INFORMATION_DESCRIPTION_ID).attr('class', LIST_CLASS);
  descriptionContainer.append('h2').text('Description');
  var list = descriptionContainer.append('ul');
  list.append('li').attr('id', INFORMATION_ALGORITHM_ID);
}

function createInformation() {
  var container = getInformationRightContainer();
  createStats(container);
  createLegend(container);
  createAlgorithmDescription(container);
  var container = getInformationLeftContainer();
  createAlgorithmProperties(container);
  createAlgorithmInformation(container);
}

function updateStats() {
  d3.select('#' + STATS_COMPARISONS_ID).text("Comparisons: " + sortingStats.numberOfComparisons);
  d3.select('#' + STATS_SWAPS_ID).text("Swaps: " + sortingStats.numberOfSwaps);
}

function updateAlgorithmInformation(algorithm) {
  if (algorithm != undefined) {
    if (algorithm.name != undefined) {
      d3.select('#' + INFORMATION_NAME_ID).text("Name: " + algorithm.name);
    }
    if (algorithm.bestCase != undefined) {
      d3.select('#' + INFORMATION_BEST_CASE_COMPLEXITY_ID).text("Best case: " + algorithm.bestCase);
    }
    if (algorithm.averageCase != undefined) {
      d3.select('#' + INFORMATION_AVERAGE_CASE_COMPLEXITY_ID).text("Average case: " + algorithm.averageCase);
    }
    if (algorithm.worstCase != undefined) {
      d3.select('#' + INFORMATION_WORST_CASE_COMPLEXITY_ID).text("Worst case: " + algorithm.worstCase);
    }
    if (algorithm.memory != undefined) {
      d3.select('#' + INFORMATION_MEMORY_ID).text("Memory: " + algorithm.memory);
    }
    if (algorithm.stable != undefined) {
      d3.select('#' + INFORMATION_STABLE_ID).text("Stable: " + algorithm.stable);
    }
    if (algorithm.technique != undefined) {
      d3.select('#' + INFORMATION_TECHNIQUE_ID).text("Technique: " + algorithm.technique);
    }
    if (algorithm.algorithm != undefined) {
      d3.select('#' + INFORMATION_ALGORITHM_ID).text(algorithm.algorithm);
    }
    if (algorithm.technique != undefined) {
      d3.select('#' + INFORMATION_DESCRIPTION_ID).text(algorithm.description);
    }
  }
}

/* ------------------------------------------------------------------------- */
/* UI Creation
/* ------------------------------------------------------------------------- */

/**
 * Creates the UI
 */
function createUI() {
  if (mainContainerExsists()) {
    createContainers();
    createGraph();
    updateGraphDimensions();
    createInformation();
    createControls();
  } else {
    info('No element found with id "' + PARENT_CONTAINER_ID + '"');
    info('Please create a div with that id where you wish for the visualiser to be created.');
  }
}

/* ------------------------------------------------------------------------- */
/* Render
/* ------------------------------------------------------------------------- */

function getClassForBar(d) {
  if (d.x == sortingCurrentIndex) {
    return BAR_ACTIVE_CLASS;
  }
  if (d.x == sortingComparisonIndex) {
    return BAR_COMPARISON_CLASS;
  }
  if (d.x == sortingLeftBound || d.x == sortingRightBound) {
    return BAR_BOUND_CLASS;
  }
  return BAR_NORMAL_CLASS;
}

/**
 * Returns the data to render in a usable format for d3.js
 */
function getRenderData() {
  var out = [];
  var data = arrayToSort.slice();
  for (var i = 0; i < data.length; i++) {
    out.push({
      x: i,
      y: data[i]
    });
  }
  return out;
}

function getWidthOfBar(numberOfElements) {
  return graphDimensions.width / numberOfElements - 1;
}

function getHeightOfBar(d) {
  return graphDimensions.height - margin.top- graphScale.y(d.y);
}

/**
 * Renders the graph to screen
 */
function render() {
  var dataToRender = getRenderData();
  if (dataToRender == undefined || dataToRender == null) {
    return;
  }
  graphScale.y.domain([0, d3.max(arrayToSort)]);
  graphScale.x.domain([0, arrayToSort.length]);

  var graph = d3.select('#' + GRAPH_ID);

  //Reset all bars (not used to not interact with legend)
  d3.selectAll('.' + BAR_ACTIVE_CLASS + ':not(.' + LEGEND_ITEM_CLASS + ')').attr('class', BAR_NORMAL_CLASS);
  d3.selectAll('.' + BAR_COMPARISON_CLASS + ':not(.' + LEGEND_ITEM_CLASS + ')').attr('class', BAR_NORMAL_CLASS);
  d3.selectAll('.' + BAR_BOUND_CLASS + ':not(.' + LEGEND_ITEM_CLASS + ')').attr('class', BAR_NORMAL_CLASS);

  var bars = graph.selectAll('.' + BAR_NORMAL_CLASS)
    .data(dataToRender);

  bars.enter().append("rect")
    .attr("class", function(d) {
      return getClassForBar(d)
    })
    .attr("x", function(d) {
      return graphScale.x(d.x);
    })
    .attr("width", getWidthOfBar(dataToRender.length))
    .attr("y", function(d) {
      return graphScale.y(d.y);
    })
    .attr("height", function(d) {
      return getHeightOfBar(d);
    })
    .attr("transform", "translate(" + margin.left + ", " + margin.top + "0)");

  bars.attr("class", function(d) {
      return getClassForBar(d)
    })
    .attr("x", function(d) {
      return graphScale.x(d.x);
    })
    .attr("width", getWidthOfBar(dataToRender.length))
    .attr("y", function(d) {
      return graphScale.y(d.y);
    })
    .attr("height", function(d) {
      return getHeightOfBar(d);
    })
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  bars.exit().remove();
}

function updateScreen() {
  //Yeild
  setTimeout(function() {
    render();
    updateStats();
  }, 0);
}

/* ------------------------------------------------------------------------- */
/* Audio
/* ------------------------------------------------------------------------- */

function initAudio() {
  audioContext = new AudioContext();
  info(audioContext);
}

function startSound() {
  if (!soundOn) {
    return;
  }
  info('Starting sound');
  if (audioContext != undefined) {
    audioOscillator = audioContext.createOscillator();
    audioOscillator.connect(audioContext.destination);
    audioOscillator.start(0);
  }
}

function stopSound() {
  if (!soundOn) {
    return;
  }
  if (audioOscillator != undefined) {
      info('Stoping sound');
    audioOscillator.stop(0);
  }
}

function playFrequency(fequency) {
  if (!soundOn) {
    return;
  }
  if (audioOscillator != undefined) {
    audioOscillator.frequency.value = fequency;
  }
}

function playSoundForValue(value) {
  playFrequency(110 + Math.pow(1000, value / MAX_VALUE));
}

/* ------------------------------------------------------------------------- */
/* Screen Arrangement
/* ------------------------------------------------------------------------- */

function getWidthInEm(element) {
  return element.width() / parseFloat($('body').css('font-size'));
}

function getWidthOfContainerInEm() {
  return getWidthInEm($('#' + MAIN_CONTAINER_ID));
}

function setPercentageWidthOfElement(id, width) {
  info('Setting ' + id + ' to width: ' + width.toString() + '%');
  $(id).outerWidth(width + "%");
}

function setMainContainersPercentageWidths(graphAndInformationWidth, controlsWidth) {
  setPercentageWidthOfElement('#' + GRAPH_AND_INFOMATION_CONTAINER_ID, graphAndInformationWidth);
  setPercentageWidthOfElement('#' + CONTROLS_CONTAINER_ID, controlsWidth);
}

function updateLayout() {
  var width = getWidthOfContainerInEm();
  info('Container width: ' + width + 'em');

  //Main container positioning
  if (width < 50) {
    setMainContainersPercentageWidths(98, 100);
  } else if (width < 60) {
    setMainContainersPercentageWidths(68, 30);
  } else if (width < 75) {
    setMainContainersPercentageWidths(73, 25);
  } else {
    setMainContainersPercentageWidths(78, 20);
  }

  //Adjust stat width to prevent overflow
  if (width < 70) {
    setPercentageWidthOfElement('.' + STAT_CLASS, 100);
  } else {
    setPercentageWidthOfElement('.' + STAT_CLASS, 50);
  }

  //When screen compresses to single column adjusts the controls and settings tab
  if (width < 50 && width > 30) {
    setPercentageWidthOfElement('#' + ALGORITHMS_CONTROLS_CONTAINER_ID, 48);
    setPercentageWidthOfElement('#' + ALGORITHMS_SETTINGS_CONTAINER_ID, 48);
  } else {
    setPercentageWidthOfElement('#' + ALGORITHMS_CONTROLS_CONTAINER_ID, 98);
    setPercentageWidthOfElement('#' + ALGORITHMS_SETTINGS_CONTAINER_ID, 98);
  }

  //When screen compresses to single column adjusts the stats and legend tab
  if (width < 30) {
      setPercentageWidthOfElement('#' + INFORMATION_LEFT_CONTAINER_ID, 99.5);
      setPercentageWidthOfElement('#' + INFORMATION_RIGHT_CONTAINER_ID, 99.5);
    } else {
      setPercentageWidthOfElement('#' + INFORMATION_LEFT_CONTAINER_ID, 49.5);
      setPercentageWidthOfElement('#' + INFORMATION_RIGHT_CONTAINER_ID, 49.5);
  }
}

/* ------------------------------------------------------------------------- */
/* Generation of data
/* ------------------------------------------------------------------------- */

/**
 * Generates a best case array to sort.
 * Best case defined as ascending order
 */
function generateBestCase() {
  arrayToSort = [];
  var delta = (MAX_VALUE - 1) / numberOfElementsToSort;
  for (var i = 0; i < numberOfElementsToSort; i++) {
    arrayToSort.push(i * delta + 1);
  }
}

/**
 * Generates a random case array to sort.
 * Best case defined as random order
 */
function generateRandomData() {
  arrayToSort = [];
  for (var i = 0; i < numberOfElementsToSort; i++) {
    arrayToSort.push(Math.random() * (MAX_VALUE - 1)) + 1;
  }
}

/**
 * Generates a worst case array to sort.
 * Best case defined as descending order
 */
function generateWorstCase() {
  arrayToSort = [];
  for (var i = 0; i < numberOfElementsToSort; i++) {
  var delta = (MAX_VALUE) / numberOfElementsToSort;
    arrayToSort.push(MAX_VALUE - i * delta);
  }
}

function generateData() {
  if (!sortingAlgorithmCurrentlyRunning) {
    arrayGenerationAlgorithm();
    updateScreen();
  }
}

/* ------------------------------------------------------------------------- */
/* Sorting algorithms
/* ------------------------------------------------------------------------- */

/* ---- Bubble Sort ---- */
function bubbleSort() {
  startSortingAlgorithm();
  var sorted = true;
  var i = 0;
  info('Bubble sort started');
  //Pass variables to inner function
  (function(arrayToSort, sorted, i) {
    sortingAlgorithmLoop = setInterval(function() {
      sortingCurrentIndex = i;
      sortingComparisonIndex = i + 1;
      playSoundForValue(arrayToSort[i + 1]);
      //Comparison
      sortingStats.numberOfComparisons++;
      if (arrayToSort[i] > arrayToSort[i + 1]) {
        //Swap
        sortingStats.numberOfSwaps++;
        var temp = arrayToSort[i];
        arrayToSort[i] = arrayToSort[i + 1];
        arrayToSort[i + 1] = temp;
        sorted = false;
      }
      i++;
      //Return to start of array when done
      if (i >= arrayToSort.length - 1) {
        i = 0;
        if (sorted || !sortingAlgorithmCurrentlyRunning) {
          info('Bubble sort ended');
          stopSortingAlgorithm();
        }
        sorted = true;
      }
      updateScreen();
    }, sortingStepDelay);
  })(arrayToSort, sorted, i);
}

/* ------------------------------------------------------------------------- */
window.onload = function() {
  info('Load');
  createUI();
  initAudio();
  generateRandomData();
  updateScreen();
  updateLayout();
}

window.onresize = function() {
  updateLayout();
  updateGraphDimensions();
  updateScreen();
}
