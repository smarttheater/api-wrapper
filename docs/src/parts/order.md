# Data Structure

## Types.Order.Search

-   orderDate: `xxx` (string, optional) - 注文日時 ISO 8601 date format
-   confirmationNumber: `xxx` (string, required) - 確認番号
-   orderNumber: `xxx` (string, required) - 注文番号
-   price: `1000` (number, required) - 注文金額
-   orderStatus: `OrderDelivered` (enum, optional) - 注文ステータス OrderDelivered(注文済み) or OrderReturned(注文返品済み)
    -   `OrderDelivered` (string) - 注文済み
    -   `OrderReturned` (string) - 注文返品済み

## Types.Order.FindByConfirmationNumber

-   orderDate: `xxx` (string, optional) - 注文日時 ISO 8601 date format
-   confirmationNumber: `xxx` (string, required) - 確認番号
-   orderNumber: `xxx` (string, required) - 注文番号
-   price: `1000` (number, required) - 注文金額
-   orderStatus: `OrderDelivered` (enum, optional) - 注文ステータス OrderDelivered(注文済み) or OrderReturned(注文返品済み)
    -   `OrderDelivered` (string) - 注文済み
    -   `OrderReturned` (string) - 注文返品済み

## Types.Order.SearchAcceptedOffersByConfirmationNumber.priceComponent

-   name (object, optional)
    -   ja: `xxx` (string, optional) - 価格要素名称（日本語）
    -   en: `xxx` (string, optional) - 価格要素名称（英語）
-   price: `1000` (number, required) - 価格要素価格
-   typeOf: `UnitPriceSpecification` (enum, required) - 価格要素タイプ CategoryCodeChargeSpecification (カテゴリーコード加算仕様) or MovieTicketTypeChargeSpecification (ムビチケ加算仕様) or UnitPriceSpecification (単価仕様)
    -   `UnitPriceSpecification` (string) - 単価仕様
    -   `CategoryCodeChargeSpecification` (string) - カテゴリーコード加算仕様
    -   `MovieTicketTypeChargeSpecification` (string) - ムビチケ加算仕様
-   referenceQuantity

    -   value: `1` (number, optional) - 価格要素基準数量

## Types.Order.SearchAcceptedOffersByConfirmationNumber

-   itemOffered (object, optional)
    -   id: `xxx` (number, required) - 予約 id
    -   reservationNumber: `xxx` (number, required) - 予約番号
    -   reservedTicket
        -   ticketType
            -   identifier: `xxx` (string, required) - オファーコード
            -   name (object, optional)
                -   ja: `xxx` (string, optional) - オファー名称（日本語）
                -   en: `xxx` (string, optional) - オファー名称（英語）
        -   ticketedSeat (object, optional)
            -   seatNumber: `xxx` (string, required) - 座席コード
            <!-- -   seatRow: `xxx` (string, required) - 座席行` -->
            -   seatSection: `xxx` (string, required) - 座席セクション
    -   priceSpecification
        -   priceComponent (array, required, fixed-type)
            -   (Types.Order.SearchAcceptedOffersByConfirmationNumber.priceComponent) - 価格要素

# Group 注文

<!-- ## 注文検索 [/projects/{id}/order/search{?page,limit,orderDate.lte,orderDate.gte,orderNumbers,confirmationNumbers}]

### 注文検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクトid
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100
    -   orderDate.lte: `2023-01-01T00:00:00.000Z` (string, optional) - 注文日時範囲(から)ISO 8601 date format
    -   orderDate.gte: `2023-01-01T00:00:00.000Z` (string, optional) - 注文日時範囲(まで)ISO 8601 date format
    -   orderNumbers: `['xxx']` (array, optional) - 注文番号リスト
    -   confirmationNumbers: `['xxx']` (array, optional) - 確認番号リスト

-   Response 200 (application/json)

    -   Attributes (array, fixed-type)
        -   (Types.Order.Search) - 注文` -->

## 確認番号で注文検索 [/projects/{id}/order/findByConfirmationNumber{?confirmationNumber,customer.telephone}]

### 確認番号で注文検索[GET]

-   Parameters

    -   confirmationNumber: `xxx` (string, required) - 確認番号
    -   customer.telephone: `+819012345678` (string, required) - 購入者電話番号 E.164

-   Response 200 (application/json)

    -   Attributes (array, fixed-type)
        -   (Types.Order.FindByConfirmationNumber) - 注文

## 注文アイテム検索 [/projects/{id}/order/searchAcceptedOffersByConfirmationNumber{?page,limit,confirmationNumber,orderNumber}]

### 注文アイテム検索[GET]

-   Parameters

    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100
    -   confirmationNumber: `xxx` (string, required) - 確認番号
    -   orderNumber: `xxx` (string, required) - 注文番号

-   Response 200 (application/json)

    -   Attributes (array, fixed-type)
        -   (Types.Order.SearchAcceptedOffersByConfirmationNumber) - 注文アイテム

## 注文コード発行 [/projects/{id}/order/authorize]

### 注文コード発行[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   confirmationNumber: `xxx` (string, required) - 確認番号
        -   expiresInSeconds: `2023-01-01T00:00:00.000Z` (string, required) - コード期限 ISO 8601 date format
        -   customer
            -   telephone: `+819012345678` (string, optional) - 購入者電話番号 E.164

-   Response 200 (application/json)

    -   Attributes
        -   id: `xxx` (string, required) - 取引 id
        -   expires: `2023-01-01T00:00:00.000Z` (string, required) - 取引期限 ISO 8601 date format
