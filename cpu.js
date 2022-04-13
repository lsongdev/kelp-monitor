class CpuCollector {
  previousCpuUsage = process.cpuUsage();
  previousTimestamp = Date.now();

  ratio() {
    const usage = process.cpuUsage(this.previousCpuUsage);

    const timestamp = Date.now();

    const ratio =
      (100 * (usage.system + usage.user)) /
      ((timestamp - this.previousTimestamp) * 1000);

    this.previousCpuUsage = process.cpuUsage();
    this.previousTimestamp = timestamp;

    return {
      total: ratio.toPrecision(3),
    };
  }
}

module.exports = CpuCollector;
