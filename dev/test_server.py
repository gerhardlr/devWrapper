import unittest
from PyTango import DeviceProxy
import numpy
import json

import deviceWrapper

class TestCase_001(unittest.TestCase):

    def setUp(self):
        deviceWrapper.app.testing = True
        self.app = deviceWrapper.app.test_client()
        self.attributes = ['ampli', 'boolean_scalar', 'double_scalar', 'double_scalar_rww', 'double_scalar_w', 'float_scalar',
     'long64_scalar', 'long_scalar', 'long_scalar_rww', 'long_scalar_w', 'short_scalar', 'short_scalar_ro',
     'short_scalar_rww', 'short_scalar_w', 'string_scalar', 'throw_exception', 'uchar_scalar', 'ulong64_scalar',
     'ushort_scalar', 'ulong_scalar', 'boolean_spectrum', 'boolean_spectrum_ro', 'double_spectrum',
     'double_spectrum_ro', 'float_spectrum', 'float_spectrum_ro', 'long64_spectrum_ro', 'long_spectrum',
     'long_spectrum_ro', 'short_spectrum', 'short_spectrum_ro', 'string_spectrum', 'string_spectrum_ro',
     'uchar_spectrum', 'uchar_spectrum_ro', 'ulong64_spectrum_ro', 'ulong_spectrum_ro', 'ushort_spectrum',
     'ushort_spectrum_ro', 'wave', 'boolean_image', 'boolean_image_ro', 'double_image', 'double_image_ro',
     'float_image', 'float_image_ro', 'long64_image_ro', 'long_image', 'long_image_ro', 'short_image', 'short_image_ro',
     'string_image', 'string_image_ro', 'uchar_image', 'uchar_image_ro', 'ulong64_image_ro', 'ulong_image_ro',
     'ushort_image', 'ushort_image_ro', 'State', 'Status']
        self.commands = [('DevBoolean', True), ('DevDouble', 0.0),
                         ('DevFloat', 0.0), ('DevLong', 0.0), ('DevLong64', 0.0), ('DevShort', 0), ('DevString', '0'), ('DevULong', 0),
                         ('DevULong64', 0), ('DevUShort', 0),
                         ('DevVarCharArray', numpy.asarray([1,2,3]).astype(numpy.uint8).tolist()),
                         ('DevVarDoubleArray', numpy.asarray([0.1,0.1,0.2]).astype(numpy.float64).tolist()),
                         ('DevVarDoubleStringArray', [numpy.asarray([0.1,0.1,0.1]).astype(numpy.float64).tolist(),['aa','bb','cc']]),
                         ('DevVarFloatArray', numpy.asarray([0.1,0.1,0.1]).astype(numpy.float64).tolist()),
                         ('DevVarLong64Array', numpy.asarray([1,1,1]).astype(numpy.uint64).tolist()),
                         ('DevVarLongArray', numpy.asarray([1,1,1]).astype(numpy.uint32).tolist()),
                         ('DevVarLongStringArray', [numpy.asarray([1,1,1]).astype(numpy.uint32).tolist(),['aa','bb','cc']]),
                         ('DevVarShortArray', numpy.asarray([1,1,1]).astype(numpy.uint16).tolist()),
                         ('DevVarStringArray', ['aa','bb','cc']),
                         ('DevVarULong64Array', numpy.asarray([1,1,1]).astype(numpy.uint64).tolist()),
                         ('DevVarULongArray', numpy.asarray([1,1,1]).astype(numpy.uint64).tolist()),
                         ('DevVarUShortArray', numpy.asarray([1,1,1]).astype(numpy.uint64).tolist()),
                         ('DevVoid', None),
                         ('DumpExecutionState', None), ('Init', None), ('State', None), ('Status', None), ('SwitchStates', None)]
        self.crashCommands = [('CrashFromDevelopperThread', None), ('CrashFromOmniThread', None)]

    def test__001(self):
        rv = self.app.get('/')

    def test__002(self):
        rv = self.app.get('/REST/command_list_query/')

    def test__003(self):
        rv = self.app.get('/REST/get_attribute_list/')

    def test__004(self):
        rv = self.app.get('/REST/get_property_list/')

    def test__005(self):
        for a in self.attributes:
            rv = self.app.get('/REST/read_attribute/'+a)
    def test__006(self):
        for c in self.commands:
            try:
                arg = json.dumps(c[1])
                rv = self.app.post('/REST/command_inout/'+c[0],data=arg,
                       content_type='application/json')
            except Exception as e:
                print("exeption in test 006")
                print(c[0])
                print(c[1])
                raise





if __name__ == '__main__':
    unittest.main()