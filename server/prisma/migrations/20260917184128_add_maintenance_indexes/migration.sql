-- CreateIndex
CREATE INDEX "MaintenanceRequest_residentId_idx" ON "MaintenanceRequest"("residentId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_technicianId_idx" ON "MaintenanceRequest"("technicianId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_status_idx" ON "MaintenanceRequest"("status");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_priority_idx" ON "MaintenanceRequest"("priority");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_category_idx" ON "MaintenanceRequest"("category");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_createdAt_idx" ON "MaintenanceRequest"("createdAt");
