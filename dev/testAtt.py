from PyTango import DeviceProxy

def runTest():
    p = DeviceProxy("sys/tg_test/1")
    list = p.get_attribute_list()
    v = []i
    types = []
    result = {}
    atts = []
    for a in list:
        try :
            att = p.read_attribute(a)
            t = type(att.value)
            atts.append(att)
            v.append({'name' : a , 'type' : t})
            types.append(t)
        except:
            v.append({'name' : a , 'type' : 'error'})
    result['types'] = types
    result['att_to_types'] = v
    result['atts'] = atts
    result[]
    return result