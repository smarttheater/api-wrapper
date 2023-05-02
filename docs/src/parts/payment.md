# Group 決済

## クレジットカード決済承認 [/projects/{id}/payment/authorizeCreditCard]

### クレジットカード決済承認[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   purpose
            -   id: `xxx` (string, required) - 取引 id
        -   object
            -   amount: `1000` (number, required) - 決済金額
            -   creditCard
                -   token: `xxx` (string, required) - トークン化されたクレジットカード情報
            -   paymentMethod: `xxx` (string, required) - 決済方法区分コード
            -   issuedThrough
                -   id: `xxx` (string, required) - 決済サービス id

-   Response 200 (application/json)

    -   Attributes
        -   id: `xxx` (string, required) - 決済承認 id

## 決済承認取り消し [/projects/{id}/payment/voidTransaction]

### 決済承認取り消し[POST]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id

-   Request (application/json)

    -   Attributes
        -   purpose
            -   id: `xxx` (string, required) - 取引 id
        -   id: `xxx` (string, required) - 決済承認 id
        -   object
            -   typeOf: (enum, required) - 決済承認タイプ CreditCard(クレジットカード)
                -   `CreditCard` (string) - クレジットカード

-   Response 200 (application/json)
