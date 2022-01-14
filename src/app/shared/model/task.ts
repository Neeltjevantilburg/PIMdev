// Task //

export interface TaskRaw  {
    Id?: string,
    WhatId?: string,
    Status?: string,
    Subject?: string,
    What?: {
        attributes?: {
            type?: string,
            url?: string
        },
        Type?: string
    }
    Who?: {
        attributes?: {
            type?: string,
            url?: string
        },
        Name?: string
    }
    ActivityDate?: string
}

export interface Task  {
    Id?: string,
    WhatId?: string,
    Status?: string,
    Subject?: string,
    Type?: string,
    Name?: string,
    ActivityDate?: string
}
