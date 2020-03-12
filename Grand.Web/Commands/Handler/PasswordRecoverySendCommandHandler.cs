﻿using Grand.Core.Domain.Customers;
using Grand.Services.Common;
using Grand.Services.Messages;
using Grand.Web.Commands.Models;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Grand.Web.Commands.Handler
{
    public class PasswordRecoverySendCommandHandler : IRequestHandler<PasswordRecoverySendCommandModel, bool>
    {
        private readonly IGenericAttributeService _genericAttributeService;
        private readonly IWorkflowMessageService _workflowMessageService;

        public PasswordRecoverySendCommandHandler(
            IGenericAttributeService genericAttributeService,
            IWorkflowMessageService workflowMessageService)
        {
            _genericAttributeService = genericAttributeService;
            _workflowMessageService = workflowMessageService;
        }

        public async Task<bool> Handle(PasswordRecoverySendCommandModel request, CancellationToken cancellationToken)
        {
            //save token and current date
            var passwordRecoveryToken = Guid.NewGuid();
            await _genericAttributeService.SaveAttribute(request.Customer, SystemCustomerAttributeNames.PasswordRecoveryToken, passwordRecoveryToken.ToString());
            DateTime? generatedDateTime = DateTime.UtcNow;
            await _genericAttributeService.SaveAttribute(request.Customer, SystemCustomerAttributeNames.PasswordRecoveryTokenDateGenerated, generatedDateTime);

            //send email
            await _workflowMessageService.SendCustomerPasswordRecoveryMessage(request.Customer, request.Language.Id);

            return true;
        }
    }
}
