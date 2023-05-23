# Импортируем все пакеты, которые необходимы для нашей модели
from flask import Flask, request
import numpy as np
import joblib
from flask import jsonify
import json
import re


# Импортируем энкодеры и скейлер
labelEncoderItemId = joblib.load('./build/labelEncoderItemId.pkl')
labelEncoderLocationId = joblib.load('./build/labelEncoderLocationId.pkl')
labelEncoderAuctionType = joblib.load('./build/labelEncoderAuctionType.pkl')
labelEncoderTrusted = joblib.load('./build/labelEncoderTrusted.pkl')
ss = joblib.load('./build/standardscaler.pkl')

# Константа, на которую умножены цены ордеров
UNIT_PRICE_SILVER_MULTIPLIER = 10000

# Если процент релевантным ордеров меньше 60, тогда считаем весь объекм ордеров считаем нерелвантным
RELEVANCE_PERCENTILE = 60

# Загружаем обученную модель из текущего каталога
with open('./build/neural_network.pkl', 'rb') as model_pkl:
    rfc = joblib.load(model_pkl)

# Инициализируем приложение Flask
app = Flask(__name__)

ordersExample = '{"Orders":[{"Id":10682351244,"ItemTypeId":"T1_HIDE","ItemGroupTypeId":"T1_HIDE","LocationId":3005,"QualityLevel":1,"EnchantmentLevel":0,"UnitPriceSilver":70000,"Amount":1,"AuctionType":"offer","Expires":"2023-06-22T11:13:45.099077"},{"Id":10682701852,"ItemTypeId":"T1_HIDE","ItemGroupTypeId":"T1_HIDE","LocationId":3005,"QualityLevel":1,"EnchantmentLevel":0,"UnitPriceSilver":70000,"Amount":3,"AuctionType":"offer","Expires":"2023-06-22T13:12:28.209519"},{"Id":10683177971,"ItemTypeId":"T1_HIDE","ItemGroupTypeId":"T1_HIDE","LocationId":3005,"QualityLevel":1,"EnchantmentLevel":0,"UnitPriceSilver":70000,"Amount":3,"AuctionType":"offer","Expires":"2023-06-22T15:20:44.611154"},{"Id":10680540674,"ItemTypeId":"T1_HIDE","ItemGroupTypeId":"T1_HIDE","LocationId":3005,"QualityLevel":1,"EnchantmentLevel":0,"UnitPriceSilver":80000,"Amount":1,"AuctionType":"offer","Expires":"2023-06-21T23:47:13.677701"},{"Id":10681281094,"ItemTypeId":"T1_HIDE","ItemGroupTypeId":"T1_HIDE","LocationId":3005,"QualityLevel":1,"EnchantmentLevel":0,"UnitPriceSilver":80000,"Amount":3,"AuctionType":"offer","Expires":"2023-06-22T03:37:15.812508"},{"Id":10681562773,"ItemTypeId":"T1_HIDE","ItemGroupTypeId":"T1_HIDE","LocationId":3005,"QualityLevel":1,"EnchantmentLevel":0,"UnitPriceSilver":80000,"Amount":15,"AuctionType":"offer","Expires":"2023-06-22T05:17:23.248167"}]}'

@app.errorhandler(Exception) 
def handle_exception(error):
    return jsonify(isRelevant=True, relevance=-1, status='error', error=str(error))

@app.route('/predict_relevance')
def predict_relevance():
    orders = request.args.get('orders')

    # orders = ordersExample
    orders = json.loads(orders)['Orders']

    parsed_orders = []

    # Трансформируем ордера, такими же трансформациями, которые использовались при обучении
    for order in orders:
        orderId = order['Id']
        itemId = order['ItemTypeId']
        locationId = str(order['LocationId'])
        qualityLevel = order['QualityLevel']
        amount = order['Amount']
        auctionType = order['AuctionType']
        subtier = order['EnchantmentLevel']
        print(itemId)
        tier = re.search(r'T(\d)', itemId)

        try:
            tier = tier.group(1)
        except AttributeError:
            tier = 1
        
        # Игровые ордера умножены на константу
        unitPriceSilver = order['UnitPriceSilver'] // UNIT_PRICE_SILVER_MULTIPLIER

        # Проводим ту же трансформацию, что и в обучении
        itemId = labelEncoderItemId.transform([itemId])[0]
        auctionType = labelEncoderAuctionType.transform([auctionType])[0]
        locationId = labelEncoderLocationId.transform([locationId])[0]

        parsed_orders.append([orderId, itemId, locationId, qualityLevel, unitPriceSilver, amount, auctionType, tier, subtier])

    print(orders[0])
    print(parsed_orders[0])

    # Масштабируем
    X_test = np.array(parsed_orders)
    X_scaled = ss.transform(X_test)

    print(X_scaled)

    # Используем метод модели predict для
    # получения прогноза для доверенности данных
    result = rfc.predict(X_scaled)
    trusts = labelEncoderTrusted.inverse_transform(result)

    print(trusts)
    relevance =  round(np.count_nonzero(trusts) / len(trusts) * 100)
    isRelevant = RELEVANCE_PERCENTILE <= relevance
    print(isRelevant, relevance)

    # Возвращаем результат
    return jsonify(isRelevant=bool(isRelevant), relevance=relevance, status='ok')


if __name__ == '__main__':
    app.run()
