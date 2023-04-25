# Импортируем все пакеты, которые необходимы для нашей модели
from flask import Flask, request
import numpy as np
import joblib
from flask import jsonify

# Импортируем энкодеры и скейлер
labelEncoderItemId = joblib.load('./build/labelEncoderItemId.pkl')
labelEncoderLocationId = joblib.load('./build/labelEncoderLocationId.pkl')
labelEncoderAuctionType = joblib.load('./build/labelEncoderAuctionType.pkl')
labelEncoderTrusted = joblib.load('./build/labelEncoderTrusted.pkl')
ss = joblib.load('./build/standardscaler.pkl')

# Загружаем обученную модель из текущего каталога
with open('./build/neural_network.pkl', 'rb') as model_pkl:
    rfc = joblib.load(model_pkl)

# Инициализируем приложение Flask
app = Flask(__name__)

# Создаем конечную точку API
@app.route('/predict')
def predict_iris():
    # Считываем все необходимые параметры запроса
    orderId = request.args.get('OrderId')
    itemId = request.args.get('ItemId')
    locationId = request.args.get('LocationId')
    qualityLevel = request.args.get('QualityLevel')
    unitPriceSilver = request.args.get('UnitPriceSilver')
    amount = request.args.get('Amount')
    auctionType = request.args.get('AuctionType')
    tier = request.args.get('Tier')
    subtier = request.args.get('Subtier')

    # Проводим ту же трансформацию, что и в обучении
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
    return jsonify(trusted=bool(isTrusted[0]))


if __name__ == '__main__':
    app.run()
