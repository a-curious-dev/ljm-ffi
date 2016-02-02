
/*
 * This test makes sure that a simple LJM function call can be performed with
 * each exposed method.  Synchronous and Asynchronous versions of all three
 * types.
 * Type 1: Automatically handles converting/parsing of data into and out of
 * 		buffer data structures.
 * Type 2: Adds a try-catch around the function call that makes the 
 * 		Linux/Mac/Windows ffi implementations more similar.
 * Type 3: The raw FFI function calls.
 */


var extend = require('extend');
// Define functions to assist with handling various C data types.
var type_helpers = require('../lib/type_helpers');
var ljTypeMap = type_helpers.ljTypeMap;
var ljTypeOps = type_helpers.ljTypeOps;
var convertToFFIType = type_helpers.convertToFFIType;

var driver_const = require('ljswitchboard-ljm_driver_constants');
var ARCH_CHAR_NUM_BYTES = 1;
var ARCH_INT_NUM_BYTES = driver_const.ARCH_INT_NUM_BYTES;
var ARCH_DOUBLE_NUM_BYTES = driver_const.ARCH_DOUBLE_NUM_BYTES;
var ARCH_POINTER_SIZE = driver_const.ARCH_POINTER_SIZE;

var ENABLE_DEBUG = false;
function debug() {
	if(ENABLE_DEBUG) {
		console.log.apply(console, arguments);
	}
}
var ENABLE_LOG = true;
function log() {
	if(ENABLE_LOG) {
		console.log.apply(console, arguments);
	}
}


/* Define how the tests will be run. */
var ljm;
var liblabjack;
var ffi_liblabjack;

var approxPlatform = {
    'darwin': 'darwin',
    'mac': 'darwin',
    'win32': 'win32',
}[process.platform];
if(typeof(approxPlatform) === 'undefined') {
    approxPlatform = 'linux';
}

var LJM_VERSION_TO_TEST_FOR = {
	'linux': '1.8.7',
	'darwin': '1.8.8',
	'win32': '1.11.0'
}[approxPlatform];

/* Define Test Cases */
var test_cases = {
	'include ljm': function(test) {
		var ljm_ffi = require('../lib/ljm-ffi');

		// var ljmVersion = '1.11.0';
		var ljmVersion = undefined;
		var loadOptions = {
			// ljmVersion: 1.1100,
			// ljmVersion: '1-9-1',
			// ljmVersion: '1.9.1',
			ljmVersion: LJM_VERSION_TO_TEST_FOR,
			loadExact: true,
		};
		ljm = ljm_ffi.load(loadOptions);
		liblabjack = ljm_ffi.loadSafe(loadOptions);
		ffi_liblabjack = ljm_ffi.loadRaw(loadOptions);

		test.done();
	},
	'Execute LJM_NameToAddress (Sync)': function(test) {
		var ljmLibraryVersion = ljm.LJM_ReadLibraryConfigS('LJM_LIBRARY_VERSION', 0);
		var expectedData = {
			'ljmError': 0,
			'Parameter': 'LJM_LIBRARY_VERSION',
			'Value': ljmLibraryVersion.Value,
		};
		console.log(' - LJM Library Version:', ljmLibraryVersion.Value);
		test.deepEqual(ljmLibraryVersion, expectedData);
		test.done();
	},
	'Execute LJM_NameToAddress (Async)': function(test) {
		function testData(ljmLibraryVersion) {
			var expectedData = {
				'ljmError': 0,
				'Parameter': 'LJM_LIBRARY_VERSION',
				'Value': ljmLibraryVersion.Value,
			};
			test.deepEqual(ljmLibraryVersion, expectedData);
			test.done();
		}

		// Execute LJM Function
		ljm.LJM_ReadLibraryConfigS.async('LJM_LIBRARY_VERSION', 0, testData);
	},
};


exports.tests = test_cases;