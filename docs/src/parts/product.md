# Data Structure

## Types.Product.SearchCreditCard

-   id: `xxx` (string, required) - 決済サービス id
-   provider
    -   id: `xxx` (string, optional) - 販売者 id
    -   credentials (array, fixed-type)
        -   (Types.Product.SearchCreditCard.credentials, optional) - 決済情報
-   serviceType (array, optional)
    -   codeValue (string, required) - 決済方法区分コード

## Types.Product.SearchCreditCard.credentials

-   shopId: `xxx` (string, optional) - GMO ショップ ID
-   tokenizationCode: `xxx` (string, optional) - トークン認証コード
<!-- -   paymentUrl
    -   expiresInSeconds: `1000` (number, optional) - 外部決済URL有効時間(秒)` -->

# Group プロダクト

## 決済サービス検索 [/projects/{id}/product/searchCreditCard{?page,limit}]

### 決済サービス検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100

-   Response 200 (application/json)

    -   Attributes (array, fixed-type)
        -   (Types.Product.SearchCreditCard) - 決済サービス
