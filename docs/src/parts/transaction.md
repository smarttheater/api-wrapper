# Data Structure

## Types.Transaction.PlaceOrder.AuthorizeSeatReservation.AcceptedOffer

-   id: `xxx` (string, required) - チケットオファー id
-   itemOffered
    -   serviceOutput
        -   reservedTicket
            -   seatNumber: `xxx` (string, required) - 座席コード
            -   seatSection: `xxx` (string, required) - セクションコード

# Group 取引

## 取引開始 [/projects/{id}/transaction/placeOrder/start]

### 取引開始[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   seller
            -   id: `xxx` (string, required) - 販売者 id
        -   expires: `2023-01-01T00:00:00.000Z` (string, required) - 取引期限 ISO 8601 date format
        -   passport
            -   token: `xxx` (string, optional) - パスポート token

-   Response 200 (application/json)

    -   Attributes
        -   id: `xxx` (string, required) - 取引 id
        -   expires: `2023-01-01T00:00:00.000Z` (string, required) - 取引期限 ISO 8601 date format

## 取引確定 [/projects/{id}/transaction/placeOrder/confirm]

### 取引確定[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   id: `xxx` (string, required) - 取引 id

-   Response 200 (application/json)

    -   Attributes
        -   confirmationNumber: `xxx` (string, required) - 確認番号
        -   orderNumber: `xxx` (string, required) - 注文番号

## 取引中止 [/projects/{id}/transaction/placeOrder/cancel]

### 取引中止[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   id: `xxx` (string, required) - 取引 id

-   Response 200

## イベントオファー承認 [/projects/{id}/transaction/placeOrder/authorizeSeatReservation]

### イベントオファー承認[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   object
            -   reservationFor
                -   id: `xxx` (string, required) - イベント id
            -   acceptedOffer (array, fixed-type)
                -   (Types.Transaction.PlaceOrder.AuthorizeSeatReservation.AcceptedOffer) - チケットオファー
        -   purpose
            -   id: `xxx` (string, required) - 取引 id

-   Response 200 (application/json)

    -   Attributes
        -   id: `xxx` (string, required) - アクション id

## イベントオファー承認取り消し [/projects/{id}/transaction/placeOrder/voidSeatReservation]

### イベントオファー承認取り消し[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   id: `xxx` (string, required) - アクション id
        -   purpose
            -   id: `xxx` (string, required) - 取引 id

-   Response 200 (application/json)
