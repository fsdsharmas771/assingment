export enum healthMessages {
    HEALTH_CHECK_SUCCESSFULLY = 'Health check successfully',
    HEALTH_CHECK_FAILED = 'Health check failed',
    SUPPLIER_A_DOWN = 'Supplier A is down',
    SUPPLIER_B_DOWN = 'Supplier B is down',
    SUPPLIER_A_UP = 'Supplier A is up',
    SUPPLIER_B_UP = 'Supplier B is up',
    SUPPLIER_A_HEALTH_CHECK_FAILED = 'Supplier A health check failed',
    SUPPLIER_B_HEALTH_CHECK_FAILED = 'Supplier B health check failed',
    SUPPLIER_A_HEALTH_CHECK_SUCCESS = 'Supplier A health check successfully',
    SUPPLIER_B_HEALTH_CHECK_SUCCESS = 'Supplier B health check successfully',
}

export enum healthStatuses {
    UP = 'UP',
    DOWN = 'DOWN',
}