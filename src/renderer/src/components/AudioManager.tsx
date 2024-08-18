import { ReactElement } from "react";

interface Props {
  level: number;
}

export const BATTERY_GOOD = '#4caf50';
export const BATTERY_WARNING = '#ffeb3b';
export const BATTERY_LOW = '#f44336';

const DeviceBattery: React.FunctionComponent<Props> = (props: Props): ReactElement => {
  const { level: level } = props;

  const getColor = (percentage: number) => {
    if (percentage > 30) return BATTERY_GOOD; // Green
    if (percentage > 20) return BATTERY_WARNING; // Yellow
    return BATTERY_LOW; // Red
  };

  const levelStyle = {
    width: `${level}%`,
    backgroundColor: getColor(level),
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="device_battery__battery_cell">
        <span className="device_battery__percentage_text">{level}%</span>
        <div className="device_battery__level" style={levelStyle} />
      </div>
    </div>
  );
};

export default DeviceBattery;
