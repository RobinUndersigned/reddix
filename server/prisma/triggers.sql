CREATE TRIGGER count_votes
AFTER INSERT OR UPDATE OF Vote
ON Vote
FOR EACH ROW
EXECUTE PROCEDURE count_games();