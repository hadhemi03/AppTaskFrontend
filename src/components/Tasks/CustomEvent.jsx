import StatusColored from "../../shared/StatusColored";

const CustomEvent = ({ event }) => {
  return (
    <div>
      <strong>{event.title}</strong>
      <StatusColored status={event.status} />
    </div>
  );
};

export default CustomEvent;