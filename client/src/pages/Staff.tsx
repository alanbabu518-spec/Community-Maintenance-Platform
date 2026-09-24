import PageTransition from "../components/ui/PageTransition";
import CreateStaffForm from "../features/users/components/CreateStaffForm";

function Staff() {
  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section>
          <p className="text-sm font-medium text-primary">Management</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Staff
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Create manager and technician accounts and assign them to a
            community.
          </p>
        </section>

        <CreateStaffForm />
      </div>
    </PageTransition>
  );
}

export default Staff;
