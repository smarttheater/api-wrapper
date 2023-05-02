# Data Structure

## Types.Seller.Search

-   id: `xxx` (string, optional) - 販売者 id
-   name
    -   ja: `xxx` (string, required) - 販売者名称（日本語）
    -   en: `xxx` (string, required) - 販売者名称（英語）
-   branchCode: `xxx` (string, required) - 販売者コード

# Group 販売者

## 販売者検索 [/projects/{id}/seller/search{?page,limit}]

### 販売者検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100

-   Response 200 (application/json)

    -   Attributes (array, fixed-type)
        -   (Types.Seller.Search) - 販売者
