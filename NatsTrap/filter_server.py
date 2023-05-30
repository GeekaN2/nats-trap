# Импортируем все пакеты, которые необходимы для нашей модели
from flask import Flask, request
import numpy as np
import joblib
from flask import jsonify
import json
import re
import subprocess
import os

# Импортируем энкодеры и скейлер
labelEncoderItemId = joblib.load('./build/labelEncoderItemId.pkl')
labelEncoderLocationId = joblib.load('./build/labelEncoderLocationId.pkl')
labelEncoderAuctionType = joblib.load('./build/labelEncoderAuctionType.pkl')
labelEncoderTrusted = joblib.load('./build/labelEncoderTrusted.pkl')
ss = joblib.load('./build/standardscaler.pkl')

# Константа, на которую умножены цены ордеров
UNIT_PRICE_SILVER_MULTIPLIER = 10000

# Если процент релевантным ордеров меньше 60, тогда весь массив ордеров считаем нерелевантным
RELEVANCE_PERCENTILE = 60

# Загружаем обученную модель из текущего каталога
with open('./build/neural_network.pkl', 'rb') as model_pkl:
    rfc = joblib.load(model_pkl)

# Инициализируем приложение Flask
app = Flask(__name__)

def ban_by_ip(source_ip):
    os.system("bash /root/nats-trap/NatsTrap/blocker.sh " + str(source_ip) + " block")

@app.errorhandler(Exception) 
def handle_exception(error):
    return jsonify(isRelevant=True, relevance=-1, status='error', error=str(error))

@app.route('/predict_relevance')
def predict_relevance():
    orders = request.args.get('orders')
    source_ip = request.args.get('srcip')

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

    # Масштабируем
    X_test = np.array(parsed_orders)
    X_scaled = ss.transform(X_test)

    # Используем метод модели predict для
    # получения прогноза для доверенности данных
    result = rfc.predict(X_scaled)
    trusts = labelEncoderTrusted.inverse_transform(result)

    relevance =  round(np.count_nonzero(trusts) / len(trusts) * 100)
    isRelevant = RELEVANCE_PERCENTILE <= relevance
    print(isRelevant, relevance)

    # Вызываем скрипт для блокировки пользователя по IP
    if not bool(isRelevant):
        ban_by_ip(source_ip)

    # Возвращаем результат
    return jsonify(isRelevant=bool(isRelevant), relevance=relevance, status='ok')


@app.route('/predict')
def predict_iris():
    orderId = request.args.get('OrderId')
    itemId = request.args.get('ItemId')
    locationId = request.args.get('LocationId')
    qualityLevel = request.args.get('QualityLevel')
    unitPriceSilver = int(request.args.get('UnitPriceSilver')) // 10000
    amount = request.args.get('Amount')
    auctionType = request.args.get('AuctionType')
    tier = request.args.get('Tier')
    subtier = request.args.get('Subtier')

    # Проводим ту же трансформацию, что и в обучении модели
    itemId = labelEncoderItemId.transform([itemId])[0]
    auctionType = labelEncoderAuctionType.transform([auctionType])[0]
    locationId = labelEncoderLocationId.transform([locationId])[0]

    # Масштабируем
    X_test = np.array([[orderId, itemId, locationId, qualityLevel,
                      unitPriceSilver, amount, auctionType, tier, subtier]])
    X_scaled = ss.transform(X_test)

    # Используем метод модели predict для
    # получения прогноза для доверенности данных
    result = rfc.predict(X_scaled)
    isTrusted = labelEncoderTrusted.inverse_transform([result])

    # возвращаем результат
    return jsonify(trusted=bool(isTrusted))


if __name__ == '__main__':
    app.run()