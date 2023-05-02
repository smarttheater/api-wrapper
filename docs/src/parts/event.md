# Data Structure

## Types.Event.ScreeningEvent.Search

-   id: `xxx` (string, required) - イベント id
-   name
    -   ja: `xxx` (string, optional) - イベント名称（日本語）
    -   en: `xxx` (string, optional) - イベント名称（英語）
-   startDate: `2023-01-01T00:00:00.000Z` (string, required) - 開始日時 ISO 8601 date format
-   endDate: `2023-01-01T00:00:00.000Z` (string, required) - 終了日時 ISO 8601 date format
-   doorTime: `2023-01-01T00:00:00.000Z` (string, required) - 開場日時 ISO 8601 date format
-   maximumAttendeeCapacity: `10` (number, optional) - 最大収容人数
-   remainingAttendeeCapacity: `10` (number, optional) - 残り収容人数
-   offers (object, optional) - 販売表示情報
    -   validFrom: `2023-01-01T00:00:00.000Z` (string, optional) - 販売開始日時 ISO 8601 date format
    -   validThrough: `2023-01-01T00:00:00.000Z` (string, optional) - 販売終了日時 ISO 8601 date format
    -   availableFrom: `2023-01-01T00:00:00.000Z` (string, optional) - 表示開始日時 ISO 8601 date format
    -   availableThrough: `2023-01-01T00:00:00.000Z` (string, optional) - 表示終了日時 ISO 8601 date login
    -   login (object, optional) - ログイン時販売表示情報
        -   validFrom: `2023-01-01T00:00:00.000Z` (string, optional) - 販売開始日時 ISO 8601 date format
        -   validThrough: `2023-01-01T00:00:00.000Z` (string, optional) - 販売終了日時 ISO 8601 date format
        -   availableFrom: `2023-01-01T00:00:00.000Z` (string, optional) - 表示開始日時 ISO 8601 date format
        -   availableThrough: `2023-01-01T00:00:00.000Z` (string, optional) - 表示終了日時 ISO 8601 date format
-   location
    -   name
        -   ja: `xxx` (string, optional) - ルーム名称（日本語）
        -   en: `xxx` (string, optional) - ルーム名称（英語）
    -   branchCode: `xxx` (string, required) - ルームコード
-   superEvent
    -   id: `xxx` (string, required) - 施設コンテンツ id
    -   name
        -   ja: `xxx` (string, optional) - 施設コンテンツ名称（日本語）
        -   en: `xxx` (string, optional) - 施設コンテンツ名称（英語）
    -   headline
        -   ja: `xxx` (string, optional) - 施設コンテンツサブタイトル（日本語）
        -   en: `xxx` (string, optional) - 施設コンテンツサブタイトル（英語）
    -   description
        -   ja: `xxx` (string, optional) - 施設コンテンツ補足説明（日本語）
        -   en: `xxx` (string, optional) - 施設コンテンツ補足説明（英語）
    -   location
        -   name
            -   ja: `xxx` (string, optional) - 施設名称（日本語）
            -   en: `xxx` (string, optional) - 施設名称（英語）
        -   branchCode: `xxx` (string, required) - 施設コード
    -   workPerformed
        -   id: `xxx` (string, required) - コンテンツ id
        -   identifier: `xxx` (string, required) - コンテンツコード

## Types.Event.ScreeningEvent.SearchTicketOffers.priceComponent

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

## Types.Event.ScreeningEvent.SearchTicketOffers

-   id: `xxx` (string, required) - オファー id
-   name
    -   ja: `xxx` (string, optional) - オファー名称（日本語）
    -   en: `xxx` (string, optional) - オファー名称（英語）
-   description
    -   ja: `xxx` (string, optional) - オファー説明（日本語）
    -   en: `xxx` (string, optional) - オファー説明（英語）
-   sortIndex: `1` (string, optional) - オファー並び順
-   priceSpecification
    -   priceComponent (array, required, fixed-type)
        -   (Types.Event.ScreeningEvent.SearchTicketOffers.priceComponent) - 価格要素

## Types.Event.ScreeningEvent.SearchSeats.Offers

-   `xxx` (enum, optional) - 在庫ステータス InStock(在庫あり) or OutOfStock(在庫なし)
    -   `InStock` (string) - 在庫あり
    -   `OutOfStock` (string) - 在庫なし

## Types.Event.ScreeningEvent.SearchSeats

-   name
    -   ja: `xxx` (string, optional) - 座席名称（日本語）
    -   en: `xxx` (string, optional) - 座席名称（英語）
-   branchCode: `xxx` (string, optional) - 座席コード
-   containedInPlace
    -   name
        -   ja: `xxx` (string, optional) - セクション名称（日本語）
        -   en: `xxx` (string, optional) - セクション名称（英語）
    -   branchCode: `xxx` (string, optional) - セクションコード
-   offers (array, optional, fixed-type)
    -   (Types.Event.ScreeningEvent.SearchSeats.Offers) - 在庫ステータス

# Group イベント

## イベント検索 [/projects/{id}/event/screeningEvent/search{?page,limit,startFrom,startThrough,offers.availableFrom,offers.availableThrough}]

### イベント検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100
    -   startFrom: `2023-01-01T00:00:00.000Z` (string, required) - 開始日時範囲(から) ISO 8601 date format
    -   startThrough: `2023-01-01T00:00:00.000Z` (string, required) - 開始日時範囲(まで) ISO 8601 date format

-   Response 200 (application/json)
    -   Attributes (array, fixed-type)
        -   (Types.Event.ScreeningEvent.Search) - イベント

## イベントオファー検索 [/projects/{id}/event/screeningEvent/searchTicketOffers{?page,limit,event.id}]

### イベントオファー検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100
    -   event.id: `xxx` (string, required) - イベント id

-   Response 200 (application/json)
    -   Attributes (array, fixed-type)
        -   (Types.Event.ScreeningEvent.SearchTicketOffers) - イベントオファー

## 座席ステータス検索 [/projects/{id}/event/screeningEvent/searchSeats{?page,limit,event.id}]

### 座席ステータス検索[GET]

-   Parameters

    -   id: `xxx` (string, required) - プロジェクト id
    -   page: `1` (number, optional) - ページ
        -   Default: `1
    -   limit: `10` (number, optional) - 最大取得件数
        -   Default: `100
    -   event.id: `xxx` (string, required) - イベント id

-   Response 200 (application/json)
    -   Attributes (array, fixed-type)
        -   (Types.Event.ScreeningEvent.SearchSeats) - 座席ステータス
