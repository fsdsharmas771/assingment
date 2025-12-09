export enum hotelMessages {
    SOMETHING_WENT_WRONG = 'Something Went Wrong',
    NO_HOTELS_FOUND_IN_CACHE = 'No hotels found in cache. Please fetch hotels first without price filters.',
    HOTELS_FETCHED_SUCCESSFULLY = 'Hotels fetched successfully',
    CITY_PARAMETER_REQUIRED = 'City parameter is required',
    MIN_PRICE_PARAMETER_REQUIRED = 'Min price parameter is required',
    MAX_PRICE_PARAMETER_REQUIRED = 'Max price parameter is required',
    MIN_PRICE_MUST_BE_GREATER_THAN_0 = 'Min price must be greater than 0',
    MAX_PRICE_MUST_BE_GREATER_THAN_0 = 'Max price must be greater than 0',
    MIN_PRICE_MUST_BE_LESS_THAN_MAX_PRICE = 'Min price must be less than max price'
}