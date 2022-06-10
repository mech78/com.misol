'use strict';

const { Device } = require('homey');

class LeakDevice extends Device
{
    /**
     * onInit is called when the device is initialized.
     */
    async onInit()
    {
        this.log('LeakDevice has been initialized');
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded()
    {
        this.log('LeakDevice has been added');
    }

    /**
     * onSettings is called when the user updates the device's settings.
     * @param {object} event the onSettings event data
     * @param {object} event.oldSettings The old settings object
     * @param {object} event.newSettings The new settings object
     * @param {string[]} event.changedKeys An array of keys changed since the previous version
     * @returns {Promise<string|void>} return a custom message that will be displayed
     */
    async onSettings({ oldSettings, newSettings, changedKeys })
    {
        this.log('LeakDevice settings where changed');
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name)
    {
        this.log('LeakDevice was renamed');
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted()
    {
        this.log('LeakDevice has been deleted');
    }

    async updateCapabilities(gateway)
    {
        const dd = this.getData();
        if (dd.meterNumber)
        {
            if ((gateway.PASSKEY === dd.PASSKEY) && gateway['leak_ch' + dd.meterNumber])
            {
                this.setCapabilityValue('alarm_water', (gateway['leak_ch' + dd.meterNumber] !== '0')).catch(this.error);

                if (gateway['leakbatt' + dd.meterNumber])
                {
                    // The battery level appears to be 0 to 5 in steps of 1 representing the bar to light up
                    const bat = parseInt(gateway['leakbatt' + dd.meterNumber]) * 20;
                    this.setCapabilityValue('measure_battery', bat).catch(this.error);
                }
                else
                {
                    if (this.hasCapability('measure_battery'))
                    {
                        await this.removeCapability('measure_battery').catch(this.error);
                    }
                }
            }
        }
    }
}

module.exports = LeakDevice;