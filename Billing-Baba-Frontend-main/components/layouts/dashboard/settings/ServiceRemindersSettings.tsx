"use client";

import React, { useState } from 'react';
import ServiceReminderIntro from './ServiceReminderIntro';
import ItemSelectorForReminder from './ItemSelectorForReminder';

const ServiceRemindersSettings = () => {
    const [isServiceEnabled, setIsServiceEnabled] = useState(false);

    const handleEnableService = () => {
        setIsServiceEnabled(true);
    };

    return (
        <>
            {isServiceEnabled ? (
                <ItemSelectorForReminder />
            ) : (
                <ServiceReminderIntro onEnable={handleEnableService} />
            )}
        </>
    );
};

export default ServiceRemindersSettings;