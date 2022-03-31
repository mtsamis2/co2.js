"use strict";

/**
 * Sustainable Web Design
 *
 * Newly update calculations and figures from
 * https://sustainablewebdesign.org/calculating-digital-emissions/
 *
 *
 */
const { fileSize } = require("./constants");
const { formatNumber } = require("./helpers");

// Taken from: https://sustainablewebdesign.org/calculating-digital-emissions/#:~:text=TWh/EB%20or-,0.81%20kWH/GB,-Carbon%20factor%20(global
const KWH_PER_GB = 0.81;
// Taken from: https://ember-climate.org/data/data-explorer
// - Global carbon intensity for 2021

const GLOBAL_INTENSITY = 442;
// TODO add proper weighted average for non co2 emitting sources,
// like wind, solar, hydro
const RENEWABLES_INTENSITY = 0;

// Taken from: https://gitlab.com/wholegrain/carbon-api-2-0/-/blob/master/includes/carbonapi.php
const FIRST_TIME_VIEWING_PERCENTAGE = 0.25;
const RETURNING_VISITOR_PERCENTAGE = 0.75;
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02;
// Taken from: https://sustainablewebdesign.org/calculating-digital-emissions/#:~:text=Consumer%20device%20energy%20%3D%20AE%20x%200.52

const END_USER_DEVICE_ENERGY = 0.52;
const NETWORK_ENERGY = 0.14;
const DATACENTER_ENERGY = 0.15;
const PRODUCTION_ENERGY = 0.19;

class SustainableWebDesign {
  constructor(options) {
    this.options = options;
  }

  /**
   * Accept a figure for bytes transferred and return a figure for CO2
   * emissions. If transfer is for a domain served by renewables, return
   * a figure to account for this
   *
   * @param {Number} bytes
   * @param {boolean} green
   * @return {Number}
   */
  perByte(bytes, green) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;
    const energyUsage = transferedBytesToGb * KWH_PER_GB;
    return energyUsage * GLOBAL_INTENSITY;
  }

  energyPerVisit(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;

    const newVisitorEnergy =
      transferedBytesToGb * KWH_PER_GB * FIRST_TIME_VIEWING_PERCENTAGE;
    const returningVisitorEnergy =
      transferedBytesToGb *
      KWH_PER_GB *
      RETURNING_VISITOR_PERCENTAGE *
      PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD;

    return newVisitorEnergy + returningVisitorEnergy;
  }

  emissionsPerVisitInGrams(energyPerVisit, globalIntensity = GLOBAL_INTENSITY) {
    return formatNumber(energyPerVisit * globalIntensity);
  }

  annualEnergyInKwh(energyPerVisit, monthlyVisitors = 1000) {
    return energyPerVisit * monthlyVisitors * 12;
  }

  annualEmissionsInGrams(co2grams, monthlyVisitors = 1000) {
    return co2grams * monthlyVisitors * 12;
  }

  annualSegmentEnergy(annualEnergy) {
    return {
      consumerDeviceEnergy: formatNumber(annualEnergy * END_USER_DEVICE_ENERGY),
      networkEnergy: formatNumber(annualEnergy * NETWORK_ENERGY),
      dataCenterEnergy: formatNumber(annualEnergy * DATACENTER_ENERGY),
      productionEnergy: formatNumber(annualEnergy * PRODUCTION_ENERGY),
    };
  }
}

module.exports = SustainableWebDesign;
