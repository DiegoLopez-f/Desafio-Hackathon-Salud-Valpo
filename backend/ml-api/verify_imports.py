import importlib
import sys
packages = ['fastapi','uvicorn','numpy','joblib','sklearn']
for pkg in packages:
    try:
        m = importlib.import_module(pkg)
        v = getattr(m, '__version__', None)
        if v is None and pkg == 'sklearn':
            import sklearn as sk
            v = sk.__version__
        print(f'{pkg} => {v}')
    except Exception as e:
        print(f'{pkg} import ERROR: {e}', file=sys.stderr)
